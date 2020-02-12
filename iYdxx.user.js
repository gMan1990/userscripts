// ==UserScript==
// @name         iYdxx
// @version      0.1.3
// @description  Min version, not pro. For YunDingXX, text MUD
// @match        http://joucks.cn:3344/
// @match        http://yundingxx.com:3344/
// @grant        unsafeWindow
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @require      https://unpkg.com/element-ui@2.13.0/lib/index.js
// @namespace    http://tampermonkey.net/

// @author       gIrl1990
// @supportURL   https://github.com/gMan1990/userscripts/issues
// ==/UserScript==


/*
    Element (min)
        https://unpkg.com/element-ui@2.13.0/lib/theme-chalk/index.css
        https://unpkg.com/element-ui@2.13.0/lib/index.js
 */


jQuery(function($) {
    document.getElementById("user-task").previousElementSibling.onclick = getUserTaskFunc;
    document.body.onselectstart = null;
    document.body.style.overflowY = "overlay";
    $(document.head).append('<link rel="stylesheet" href="https://unpkg.com/element-ui@2.13.0/lib/theme-chalk/index.css">');
    let notify = function(message, type, duration, dangerouslyUseHTMLString) {
            Vue.prototype.$notify({
                message ,
                type ,
                duration ,
                dangerouslyUseHTMLString ,
                position : "bottom-right"
            });
        },
        $options = $("#sellGoodsType>option");
    if (!$options.length) {
        return notify("插件注入失败: #sellGoodsType", "error", 0);
    }
    let sellGoodsT2,
        /* Key-goods2 Map-order Val-goods2 */
        sellGoodsType = new Map([ [ $options[0].value, {
            t : $.text($options[0]),
            i : 0
        } ], [ "2", sellGoodsT2 = {
            t : "-",
            i : 1
        } ], [ "5db663ba4682c5567589308c", {
            t : "_鉴-武器",
            i : 2,
            p : sellGoodsT2
        } ], [ "5db663be0d0236567c02b9b2", {
            t : "_鉴-防具",
            i : 3,
            p : sellGoodsT2
        } ] ]);
    for (let i = 1; i < $options.length; i++) {
        let v = sellGoodsType.get($options[i].value);
        v ? (v.t = $.text($options[i]))
            : sellGoodsType.set($options[i].value, {
                t : $.text($options[i]),
                i : sellGoodsType.size
            });
    }
    /* 礼包-5df6e062a477cd1f36784c46 */
    for (let v of [ "5e104150b0a1a420d1b56f6c", "5dfe09520162325366178d48", "5db663ad4682c5567589308a", "5df30563f551bc6dc6cdfc7b" ]) {
        sellGoodsType.has(v) || sellGoodsType.set(v, {
            t : v,
            i : sellGoodsType.size
        }); }

    let tableColumnExpand = '<template v-if="c.row.user_equipment">\
            <hr style="clear: both">\
            <el-col :span="3">评分</el-col><el-col :span="3">{{c.row.user_equipment.score}}</el-col>\
            <el-col :span="3">强化等级</el-col><el-col :span="3">{{c.row.user_equipment.level}} +{{c.row.user_equipment.quality}}%</el-col>\
            <hr style="clear: both">\
            <el-col :span="3">物理伤害</el-col><el-col :span="3">+{{c.row.user_equipment.physical_damage}}</el-col>\
            <el-col :span="3">魔法伤害</el-col><el-col :span="3">+{{c.row.user_equipment.magic_damage}}</el-col>\
            <el-col :span="3">物理防御</el-col><el-col :span="3">+{{c.row.user_equipment.physical_defense}}</el-col>\
            <el-col :span="3">魔法防御</el-col><el-col :span="3">+{{c.row.user_equipment.magic_defense}}</el-col>\
            <el-col :span="3">治疗能力</el-col><el-col :span="3">+{{c.row.user_equipment.restore_damage}}</el-col>\
            <el-col :span="3">气血上限</el-col><el-col :span="3">+{{c.row.user_equipment.ph_num}}</el-col>\
            <el-col :span="3">速度</el-col><el-col :span="3">+{{c.row.user_equipment.speed}}</el-col>\
            <el-col :span="3">暴击</el-col><el-col :span="3">+{{c.row.user_equipment.crit}}</el-col>\
            <hr style="clear: both">\
            <el-col :span="2">武力</el-col><el-col :span="2">+{{c.row.user_equipment.force_num}}</el-col>\
            <el-col :span="2">智力</el-col><el-col :span="2">+{{c.row.user_equipment.iq_num}}</el-col>\
            <el-col :span="2">信仰</el-col><el-col :span="2">+{{c.row.user_equipment.faith_num}}</el-col>\
            <el-col :span="2">耐力</el-col><el-col :span="2">+{{c.row.user_equipment.endurance_num}}</el-col>\
            <el-col :span="2">敏捷</el-col><el-col :span="2">+{{c.row.user_equipment.agile_num}}</el-col>\
        </template>';
    $("#myTab").append('<li><a href="#goods2">^背包</a></li>')
        .next().append(`<div id="goods2" class="tab-pane">
                <el-container v-loading="!userGoodsErr">
                    <el-header style="padding-top: 15px">
                        <el-button size="small" @click="$refs.t.clearSelection();getUserGoods()">刷新</el-button>
                        <span class="text-danger">{{userGoodsErr}}</span>
                        <span v-if="$refs.t" style="float: right">
                            数量
                            <el-input-number v-model="commGoodsNum" step-strictly size="mini" :min="1"></el-input-number>
                            <el-button :disabled="!commGoodsNum||2>$refs.t.store.states.selection.length" size="mini" type="text" @click="makeGoods">合成</el-button>
                            <el-button :disabled="!commGoodsNum||1!=$refs.t.store.states.selection.length" size="mini" type="text" @click="useGoodsToUser">使用</el-button>
                            <br>
                            <el-button :disabled="!commGoodsNum" size="mini" type="text" @click="byGoodsToMyUser('5df6ee69f6ffda1f2ccc4739')">买500活</el-button>
                            <el-button :disabled="!commGoodsNum" size="mini" type="text" @click="byGoodsToMyUser('5dbd161e928be213f1c3accc')">买宝宝窝</el-button>
                            <el-button :disabled="!commGoodsNum" size="mini" type="text" @click="byGoodsToMyUser('5dbfcc8cd9b8c0272471e2bf')">买红药水</el-button>
                        </span>
                    </el-header>
                    <el-main>
                        <el-table ref="t" :data="userGoodsList" row-key="_id" size="mini" :default-sort="{prop:'_type',order:'ascending'}" style="font-family: monospace;width: 80%;display: inline-grid">
                            <el-table-column type="selection" reserve-selection></el-table-column>
                            <el-table-column type="expand">
                                <template slot-scope="c">
                                    <el-col :span="4">created_at</el-col><el-col :span="9">{{c.row.created_at}}</el-col>
                                    ${tableColumnExpand}
                                </template>
                            </el-table-column>
                            <el-table-column width="180">
                                <template slot-scope="h" slot="header"><el-input v-model="userGoodsSearch" clearable size="mini" placeholder="正则搜索" @input="userGoodsSearchInput"></el-input></template>
                                <template slot-scope="c">
                                    <el-popover :content="c.row.goods.info"><span slot="reference" :style="c.row.goods.style">{{c.row.goods.name}}</span></el-popover>
                                    <span v-if="c.row.user_equipment" style="float: right">{{c.row.user_equipment.wear_level}}{{eq_type[c.row.user_equipment.type]}}</span>
                                    <span v-else style="float: right">{{c.row.price}}{{price_type[c.row.price_type]}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="_page" label="页码" align="right"></el-table-column>
                            <el-table-column prop="_type" sortable :sort-orders="['ascending']" :formatter="userGoodsTypeFmt" label="分类" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="count" sortable :sort-orders="['ascending']" label="数量" align="right"></el-table-column>
                            <el-table-column label="操作" width="90">
                                <template slot-scope="c">
                                    <template v-if="c.row.user_equipment">
                                        <span class="text-muted">可售</span>
                                        <el-button :disabled="!c.row.count" size="mini" type="text" @click="wearUserEquipment(c.row)">佩戴</el-button>
                                    </template>
                                    <template v-else>
                                        <span class="text-muted">{{c.row.goods.is_sell?"可售":"禁售"}}</span>
                                        <el-button v-if="c.row.goods.use_goods" :disabled="!c.row.count" size="mini" type="text" @click="useGoodsToUser(c.row)">使用</el-button>
                                    </template>
                                </template>
                            </el-table-column>
                        </el-table>
                        <ul v-if="$refs.t" style="font-family: monospace;width: 20%;float: right">
                            已选 <el-button size="mini" type="text" @click="$refs.t.clearSelection">清空</el-button> {{$refs.t.store.states.selection.length}}
                            <li v-for="v in $refs.t.store.states.selection" :key="v._id">
                                <div>{{v.goods.name}}</div>
                                <div style="text-align: right">{{v.count}}</div>
                            </li>
                        </ul>
                    </el-main>
                </el-container>
            </div>`);

    let $log = $("#log"),
        eq_type = {
            "1" : "武",
            "2" : "甲",
            "3" : "头",
            "4" : "饰", /* 链 */
            "5" : "腰",
            "6" : "靴"
        };
    $._ydxx = {
        goods2 : new Vue({
            el : "#goods2",
            data : {
                eq_type ,
                price_type : {
                    "0" : "竹",
                    "1" : "银",
                    "2" : "金"
                },

                userGoodsSearch : "",
                userGoodsErr : " ", /* see loading */
                userGoodsList : [],
                commGoodsNum : 1
            },
            methods : {
                userGoodsSearchInput : function(s) {
                    this._userGoodsList && (this.userGoodsList = s ? this._userGoodsList.filter(function(d) {
                        return this.test(d.goods.name);
                    }, new RegExp(s)) : this._userGoodsList);
                },
                userGoodsTypeFmt : function(row) {
                    if (row.user_equipment) {
                        return sellGoodsT2.t;
                    }
                    let v = sellGoodsType.get(row.goods.goods_type);
                    return v ? v.t : row.goods.goods_type;
                },
                /**
                 * # 未知分类
                 * ## 分类编码 升序
                 * ### 名称 升序
                 * # 已知分类
                 * ## 分类序号 升序
                 * ### 装备
                 * #### 等级 升序
                 * ### 其它
                 * #### 名称 升序
                 */
                userGoodsTypeSort : function(ra, rb) {
                    if (ra.user_equipment) {
                        if (rb.user_equipment) {
                            return ra.user_equipment.wear_level - rb.user_equipment.wear_level;
                        } else {
                            return this._userGoodsTypeSort(ra, rb, sellGoodsT2, sellGoodsType.get(rb.goods.goods_type));
                        }
                    } else {
                        if (rb.user_equipment) {
                            return this._userGoodsTypeSort(ra, rb, sellGoodsType.get(ra.goods.goods_type), sellGoodsT2);
                        } else {
                            return this._userGoodsTypeSort(ra, rb, sellGoodsType.get(ra.goods.goods_type), sellGoodsType.get(rb.goods.goods_type));
                        }
                    }
                },
                _userGoodsTypeSort : function(ra, rb, va, vb) {
                    if (va) {
                        if (vb) {
                            if (va.i != vb.i) {
                                return va.i - vb.i;
                            }
                        } else {
                            return 1;
                        }
                    } else {
                        if (vb) {
                            return -1;
                        } else {
                            if (ra.goods.goods_type != rb.goods.goods_type) {
                                return ra.goods.goods_type < rb.goods.goods_type ? -1 : 1;
                            }
                        }
                    }
                    return ra.goods.name == rb.goods.name ? 0 : (ra.goods.name < rb.goods.name ? -1 : 1);
                },

                getUserGoods : function() {
                    this.userGoodsErr = ""; /* lock */
                    this._userGoodsList = []; /* new array, !=ugl */
                    this._getUserGoods(1);
                },
                _getUserGoods : function(page) {
                    let vm = this;
                    $.ajax({
                        data : {
                            page
                        },
                        url : "/api/getUserGoods",
                        success : function(d, t, x) {
                            if (200 == d.code) {
                                for (let v of d.data) {
                                    if (!v.goods) {
                                        if (v.user_equipment.status) {
                                            continue;
                                        }
                                        v.goods = v.user_equipment;
                                    }
                                    v._page = page;
                                    vm._userGoodsList.push(v); }
                                if (page < d.pages) {
                                    vm._getUserGoods(++page);
                                } else {
                                    vm._userGoodsList.sort(vm.userGoodsTypeSort);
                                    vm.userGoodsSearchInput(vm.userGoodsSearch);
                                    vm.userGoodsErr = " ";
                                }
                            } else {
                                this.error(x, d.msg);
                            }
                        },
                        error : function(x, t, e) {
                            vm.userGoodsList = vm._userGoodsList = [];
                            vm.userGoodsErr = e || t;
                        }
                    });
                },

                /** @param r row or event. */
                useGoodsToUser : function(r) {
                    this.userGoodsErr = ""; /* lock */
                    r._id ? this._useGoodsToUser(r, 1) : this._useGoodsToUser(this.$refs.t.store.states.selection[0], this.commGoodsNum);
                },
                /** @param lastIndex 1 or commGoodsNum. */
                _useGoodsToUser : function(r, lastIndex) {
                    let vm = this;
                    $.ajax({
                        data : {
                            ugid : r._id
                        },
                        type : "POST",
                        url : "/api/useGoodsToUser",
                        success : function(d, t, x) {
                            if (200 == d.code) {
                                r.count--;
                                $log.prepend(`<p class="loginfo" style="color: coral;word-break: break-all">使用 [<span style="${r.goods.style}">${r.goods.name}</span>] ${JSON.stringify(d.data)}</p>`);
                                notify(JSON.stringify(d), "success", 4500, true);
                                if (1 < lastIndex) {
                                    setTimeout(vm._useGoodsToUser, 350, r, --lastIndex);
                                } else {
                                    vm.userGoodsErr = " ";
                                }
                            } else {
                                this.error(x, d.msg);
                            }
                        },
                        error : function(x, t, e) {
                            notify(`useGoodsToUser: ${e || t}`, "error", 9000);
                            vm.userGoodsErr = " ";
                        }
                    });
                },

                makeGoods : function() {
                    this.userGoodsErr = ""; /* lock */
                    let vm = this;
                    $.ajax({
                        data : {
                            sell_json : JSON.stringify(vm.$refs.t.store.states.selection.map(v => ({
                                id : v._id,
                                count : vm.commGoodsNum
                            }))),
                            sell_type : "make"
                        },
                        type : "POST",
                        url : "/api/makeGoods",
                        success : function(d, t, x) {
                            if (200 == d.code) {
                                for (let v of vm.$refs.t.store.states.selection) {
                                    v.count -= vm.commGoodsNum; }
                                $log.prepend(`<p class="loginfo">合成 [<span style="${d.data.goods.style}">${d.data.goods.name}</span>] *${d.data.count}</p>`);
                                notify(JSON.stringify(d), "success");
                                vm.userGoodsErr = " ";
                            } else {
                                this.error(x, d.msg);
                            }
                        },
                        error : function(x, t, e) {
                            notify(`makeGoods: ${e || t}`, "error", 9000);
                            vm.userGoodsErr = " ";
                        }
                    });
                },

                wearUserEquipment : function(r) {
                    this.userGoodsErr = ""; /* lock */
                    let vm = this;
                    $.ajax({
                        data : {
                            ueid : r.user_equipment._id,
                            status : 0
                        },
                        type : "POST",
                        url : "/api/wearUserEquipment",
                        success : function(d, t, x) {
                            if (200 == d.code) {
                                r.count--;
                                $log.prepend(`<p>佩戴 [<span style="${d.data.style}">${d.data.name}</span>]</p>`);
                                notify(JSON.stringify(d), "success");
                                vm.userGoodsErr = " ";
                            } else {
                                this.error(x, d.msg);
                            }
                        },
                        error : function(x, t, e) {
                            notify(`wearUserEquipment: ${e || t}`, "error", 9000);
                            vm.userGoodsErr = " ";
                        }
                    });
                },

                byGoodsToMyUser : function(gid) {
                    this.userGoodsErr = ""; /* lock */
                    this._byGoodsToMyUser(gid, this.commGoodsNum);
                },
                _byGoodsToMyUser : function(gid, lastIndex) {
                    let vm = this;
                    $.ajax({
                        data : {
                            gid
                        },
                        type : "POST",
                        url : "/api/byGoodsToMyUser",
                        success : function(d, t, x) {
                            if (200 == d.code) {
                                $log.prepend(`<p class="loginfo">购得 [<span style="${d.data.style}">${d.data.name}</span>] *1 单价=${d.data.price}${vm.price_type[d.data.price_type]}</p>`);
                                notify(JSON.stringify(d), "success");
                                if (1 < lastIndex) {
                                    setTimeout(vm._byGoodsToMyUser, 350, gid, --lastIndex);
                                } else {
                                    vm.userGoodsErr = " ";
                                }
                            } else {
                                this.error(x, d.msg);
                            }
                        },
                        error : function(x, t, e) {
                            notify(`byGoodsToMyUser: ${e || t}`, "error", 9000);
                            vm.userGoodsErr = " ";
                        }
                    });
                }
            }
        })
    };
});
