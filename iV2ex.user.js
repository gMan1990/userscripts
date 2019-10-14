// ==UserScript==
// @name         iV2ex
// @namespace    https://github.com/gMan1990/userscripts
// @supportURL   https://github.com/gMan1990/userscripts/issues
// @version      0.1
// @description  reply_content markdown, like clone sort, image preview
// @author       gIrl1990
// @match        https://github.com/*/*/branches/all
// @match        https://v2ex.com/t/*
// @match        https://*.v2ex.com/t/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.x-git.min.js
// @require      https://unpkg.com/mapsort/compiled/iife/mapsort.min.js
// @require      https://cdn.jsdelivr.net/npm/showdown/dist/showdown.min.js
// ==/UserScript==


/*
- jQuery https://code.jquery.com/jquery/
- mapsort https://github.com/Pimm/mapsort
- TinySort https://tinysort.sjeiti.com/

- https://www.reddit.com/r/javascript/comments/9sb87m/chrome_70_and_nodejs_11_no_longer_sort_arrays
 */


jQuery.noConflict(true)($ => {
    if ("github.com" == location.hostname) {
        var $bsp = $("#branch-autoload-container>div>ul");
        for (var _c = true, $pn = $("div.pagination>a"); _c && "Next" == $pn.text();) {
            $.ajax({
                async : false,
                url : $pn.attr("href"),
                success : function(d) {
                    $bsp.append($("li[data-branch-name]", d));
                    $pn = $("div.pagination>a", d);
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
            }, (a, b) => a == b ? 0 : (a > b ? -1 : 1)));
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
                        simplifiedAutoLink : true
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

                $("#Main div.cell[id]").each((i, e) => {
                    var content = searchContent(e);
                    if (content) {
                        /* https://v2ex.com/t/608215?p=1#r_8011678 not safe */
                        content = content.replace(new RegExp("(^|\\n)(```.*?\\n)`{1,2}(?=\\r?\\n|$)", "gs"), function(m, g1, g2) {
                            return g1 + g2 + "```";
                        });

                        /* https://v2ex.com/t/597385?p=1#r_7848594 */
                        content = content.replace(/^#[^#]/, function(m) {
                            return "\\" + m;
                        });

                        /* https://v2ex.com/t/608758?p=1#r_8018645 */
                        content = content.replace(new RegExp("^(?!```)(.+\\r?\\n)(-{2,}(\\r?\\n|$))"), function(m, g1, g2) {
                            return g1 + "\\" + g2;
                        });

                        /* replace before markdown */
                        var $cont = $(mconv.makeHtml(content));
                        /* replace after  markdown */

                        /* https://v2ex.com/t/608634?p=1#r_8016535 */
                        $cont.find("a").each((ii, aa) => {
                            if (/\.(gif|png|jpg)$/.test(aa.pathname)) {
                                aa.outerHTML = '<img src="' + aa.href + '">';
                            }
                        });

                        $cont.filter("p").each((ii, pp) => {
                            var $pp = $(pp);
                            $.each([
                                /* https://v2ex.com/t/607529?p=1 */
                                [ /((^|\s)@)([^@\s]+)/g, function(m, g1, g2, g3) {
                                    return g1 + '<a href="/member/' + g3 + '">' + g3 + '</a>';
                                } ], [ new RegExp("(^|\\s)(/?t/\\d+(\\?p=\\d+)?(#\\S+)?)(?=\\s|$)", "g"), function(m, g1, g2) {
                                    return g1 + '<a target="_blank" href="' + ("/" == g2[0] ? g2 : ("/" + g2)) + '" rel="nofollow">' + g2 + '</a>';
                                } ]
                                /* https://v2ex.com/t/608455?p=1#r_8015514 网址形式太复杂暂不处理 */
                            ], (iii, vvv) => {
                                var contArr = [];
                                $pp.contents().each((iiii, ppcc) => {
                                    if (Node.TEXT_NODE == ppcc.nodeType) {
                                        contArr.push(ppcc.nodeValue.replace(vvv[0], vvv[1]));
                                    } else {
                                        contArr.push(ppcc.outerHTML);
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
            }
        });
    }
});
