// ==UserScript==
// @name         iV2ex
// @namespace    https://github.com/gMan1990/userscripts
// @supportURL   https://github.com/gMan1990/userscripts/issues
// @version      0.1.6
// @description  reply_content markdown, like clone sort, image viewer
// @author       gIrl1990
// @match        https://github.com/*/*/branches/all
// @match        https://v2ex.com/t/*
// @match        https://*.v2ex.com/t/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.x-git.min.js
// @require      https://unpkg.com/mapsort/compiled/iife/mapsort.min.js
// @require      https://cdn.jsdelivr.net/npm/showdown/dist/showdown.min.js
// @require      https://cdn.jsdelivr.net/gh/leizongmin/js-xss/dist/xss.min.js
// ==/UserScript==


/*
- jQuery https://code.jquery.com/jquery/
- mapsort https://github.com/Pimm/mapsort
- TinySort https://tinysort.sjeiti.com/

- https://www.reddit.com/r/javascript/comments/9sb87m/chrome_70_and_nodejs_11_no_longer_sort_arrays
 */


// function/=>
jQuery.noConflict(true)($ => {
    var sortDesc = (a, b) => a == b ? 0 : (a > b ? -1 : 1);

    if ("github.com" == location.hostname) {
        var $bsp = $("#branch-autoload-container>div>ul");
        for (var _c = true, $pn = $("div.pagination>a:last-of-type"); _c && "Next" == $pn.text();) {
            $.ajax({
                async : false,
                url : $pn.attr("href"),
                success : function(d) {
                    $bsp.append($("li[data-branch-name]", d));
                    $pn = $("div.pagination>a:last-of-type", d);
                },
                error : function() {
                    _c = false;
                    $("div.Box-header>span").text((i, v) => v + " (Warning: only include page 1)");
                }
            });
        }
        var $bs = $("li[data-branch-name]", $bsp);
        if (1 < $bs.length) {
            $bsp.html(mapSort($bs, function(e) {
                return $("time-ago", e).attr("datetime");
            }, sortDesc));
        }
    } else if (/\bv2ex\.com$/.test(location.hostname)) {
        $.ajax({ /* https://v2ex.com/t/608215?p=1#r_8011719 */
            data : {
                topic_id : location.pathname.substr(3),
                _t : new Date().getTime()
            },
            url : "/api/replies/show.json",
            success : function(d) {
                var mconv = new showdown.Converter({
                        simpleLineBreaks : true,
                        simplifiedAutoLink : true,
                        literalMidWordUnderscores : true,
                        omitExtraWLInCodeBlocks : true,
                        tables : true
                    }),
                    lastIndex = -1,
                    searchContent = e => {
                        for (; ++lastIndex < d.length;) {
                            if ("r_" + d[lastIndex].id == e.id) {
                                /* https://v2ex.com/t/608455?p=1#r_8013651 */
                                /* https://v2ex.com/t/608455?p=2#r_8016948 */
                                /* !content_rendered; simplifiedAutoLink */
                                return d[lastIndex].content;
                            }
                        }
                    };
                /* for development */ window._iV2ex = {$ : $, M : mconv };

                var $replies = $("#Main div.cell[id]").each((i, e) => {
                    var content = searchContent(e);
                    if (content) {
                        /* https://v2ex.com/t/609635?p=1#r_8032938 可以添加编辑后重新 Md */
                        /* https://v2ex.com/t/608215?p=1#r_8011678 not safe */
                        content = content.replace(new RegExp("(^|\\n)(```.*?\\n)`{1,2}(?=\\r?\\n|$)", "gs"), function(m, g1, g2) {
                            return g1 + g2 + "```";
                        });

                        /* https://v2ex.com/t/609213?p=1#r_8025750 */
                        content = content.replace(new RegExp("^(((?!```).*\\r?\\n)*?)(#[^#])"), function(m, g1, g2, g3) {
                            return g1 + "\\" + g3;
                        });

                        /* https://v2ex.com/t/610456?p=1#r_8044975 */
                        content = content.replace(new RegExp("^(((?!```).*\\r?\\n)+?)((-{2,}|={2,}) *(\\r?\\n|$))"), function(m, g1, g2, g3) {
                            return g1 + "\\" + g3;
                        });

                        /* https://v2ex.com/t/610724?p=1#r_8049134 */
                        /* to do */

                        /* replace before markdown */
                        var $cont = $(mconv.makeHtml(content));
                        /* replace after  markdown */

                        /* https://v2ex.com/t/610120?p=1#r_8044233 */
                        if ($cont.filter("script").length) {
                            return true;
                        }

                        /* https://v2ex.com/t/610258?p=1#r_8042218 */
                        $cont.find("img[alt='']").attr("alt", "alt");

                        /* https://v2ex.com/t/609990?p=1#r_8037987 显示Gist 代码暂不处理 */
                        /* https://v2ex.com/t/608634?p=1#r_8016535 */
                        $cont.children("a").each((ii, aa) => {
                            if (/\.(gif|png|jpg)$/.test(aa.pathname)) {
                                aa.outerHTML = '<img alt="alt" src="' + aa.href + '">';
                            }
                        });

                        $cont.filter("p").each((ii, pp) => {
                            var $pp = $(pp);
                            // TODO
                            [
                                /* https://v2ex.com/t/607529?p=1 */
                                [ /((^|\s)@)([^@\s]+)/g, function(m, g1, g2, g3) {
                                    return g1 + '<a href="/member/' + g3 + '">' + g3 + '</a>';
                                } ], [ new RegExp("(^|\\s)(/?t/\\d+(\\?p=\\d+)?(#\\S+)?)(?=\\s|$)", "g"), function(m, g1, g2) {
                                    return g1 + '<a target="_blank" href="' + ("/" == g2[0] ? g2 : ("/" + g2)) + '" rel="nofollow">' + g2 + '</a>';
                                } ]
                                /* https://v2ex.com/t/608455?p=1#r_8015514 网址形式太复杂暂不处理 */
                            ].forEach((vvv, iii, aaa) => {
                                var contArr = [];
                                $pp.contents().each((iiii, ppcc) => {
                                    /* https://v2ex.com/t/610091?p=1#r_8101694 */
                                    if (Node.TEXT_NODE == ppcc.nodeType) {
                                        var cont = filterXSS(ppcc.nodeValue.replace(vvv[0], vvv[1]));
                                        if (0 == iii) {
                                            cont = cont.replace(/&/g, "&" + Array(aaa.length).fill("amp;").join(""));
                                        }
                                        contArr.push(cont);
                                    } else {
                                        contArr.push(filterXSS(ppcc.outerHTML));
                                    }
                                });
                                $pp.html(contArr);
                            });
                        });

                        $("div.reply_content", e).html($cont).find("pre>code").each((ii, ee) => {
                            hljs.highlightBlock(ee);
                        });
                    }
                });

                $("#Rightbar>div.box").first().append(mapSort($replies.find("div.reply_content").parent().filter((i, e) => {
                    return $(">span.small.fade", e).text().substr(2) > 1;
                }).clone().each((i, e) => {
                    e.style.display = "block";
                    e.style.borderTop = "1px dotted";
                    e.style.margin = "2px 2px 0";
                    e.style.fontSize = "13px";
                }), function(e) {
                    return Number($(">span.small.fade", e).text().substr(2));
                }, sortDesc));
                $("<style>#Rightbar .reply_content { font-size: 12px; } #Rightbar>div>td>div.fr { display: none; }</style>").appendTo(document.head);
            }
        });
    }
});
