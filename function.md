这是一个抖音中控台自动弹讲解的项目，用户可以把添加到橱窗的商品，点击自动讲解。然后插件就会按照一定的时间间隔来弹商品讲解
我们需要先hook抖音的商品列表请求，然后获取到商品的id以及推广id，在调用谈讲解的接口来给指定的商品弹讲解

以下是商品列表的接口：
https://buyin.jinritemai.com/api/anchor/livepc/promotions_v2?list_type=1&source_type=force&promotion_ids=3730496070145456699%2C3704967819658673569%2C3711855145873765081%2C3685860917867902822%2C3734133035927488347%2C3688160498446170003%2C3737699154965692804%2C3735407708426338441%2C3726881879710903803&extra=hit_marketing_ab&promotion_info_fields=all&room_info_fields=all&verifyFp=verify_m7ru4ctu_WK2mQbLi_286Z_4YQw_B69w_qRBr01MpZ1YY&fp=verify_m7ru4ctu_WK2mQbLi_286Z_4YQw_B69w_qRBr01MpZ1YY&msToken=7tCT26-LoWXg882VRHVm33QIwhpJsIDWjIt0h1EguTiQbgXHbppMTP6RvyoYNla70opnV9iv8HTdgbwL9JQa7WG8WdfNvdJpDgDHu1ltYuVgMVxPzTEFgdykXePA-TkRIt-0l8Kw-XjfSFZG7J2z7xbFGBT4LxpS5UJC8HkqP7Fewg%3D%3D&a_bogus=dysfgFWEOd8cK3lS8KnV9IPUUC2MNTSyWkidbKdTSoT6T7eY3nBNDOGCrxoq41VxdupHwCIHaxelYxxcQdssZo9kLmkDuK7bDG59Ig0o0qqgbFksLNfxehvzow0CWbsLl%2FCnEAk5Xssr1EclIr5dlBQGH5P9BYYpRNMRd2z9eEWgDW8khn3sO9hki6rrU99U

以下是这个接口返回的数据
```json
{
    "st": 0,
    "code": 0,
    "msg": "",
    "extra": {
        "now": 1741078510000,
        "log_id": "20250304165509697FB362D9161D18F3E8"
    },
    "data": {
        "promotions": [
            {
                "promotion_id": "3730496070145456699",
                "product_id": "3730474105137398151",
                "title": "高个子加长美式高街水洗阔腿牛仔裤女2025春季高腰显瘦宽松直筒裤",
                "cover": "https://p3-aio.ecombdimg.com/obj/ecom-shop-material/AlUKpTdZ_m_6f4f25aff18a7539d300c6eae85f8503_sx_127304_www800-800",
                "stock_num": 60427,
                "status": 2,
                "has_size_chart": true,
                "art_no": "7820",
                "warm_up": false,
                "is_kol_exclusive_channel_product": false,
                "channel_product_type": 3,
                "channel_stock_use_mode": 0,
                "channel_info": {
                    "channel_type": 0,
                    "channel_id": 0
                },
                "on_shelf_info": {
                    "can_show": false
                },
                "stock_info": {
                    "stock_num": 60427,
                    "can_show": true
                },
                "platform_label": "小店",
                "item_type": 4,
                "shop_id": "170857133",
                "tag_list": [
                    {
                        "type": 7
                    }
                ],
                "price_desc": {
                    "min_price": {
                        "origin": 5980,
                        "integer": "59",
                        "decimal": "8",
                        "suffix": ""
                    },
                    "price_text": "售价",
                    "max_price": {
                        "origin": 5980,
                        "integer": "59",
                        "decimal": "8",
                        "suffix": ""
                    }
                },
                "lottery_info": {
                    "is_lottery": false
                },
                "kol_exclusive_info": {
                    "exclusive_product": false
                },
                "exclusive_product_activity_type": 0,
                "platform_subsidy_price": 0,
                "can_seckill": false,
                "campaign_management": false,
                "in_exclusive_channel_activity": false,
                "price_level_info": {
                    "talent_price_level": {
                        "price_level": -1,
                        "price_level_desc": "",
                        "same_low_product_brief": null
                    }
                },
                "marketing_permission": {
                    "anchor_coupon_permission": false
                },
                "elastic_title": "",
                "has_prompt": false,
                "in_prompt": false,
                "has_recom_prompt": false,
                "online_room_operating_data": {
                    "pay_amt": 0,
                    "pay_combo_cnt": 0,
                    "show_ucnt": 0,
                    "click_ucnt": 0,
                    "create_ucnt": 0,
                    "pay_ucnt": 0
                },
                "stock_management": false,
                "product_card_info": {
                    "can_set_product_card": false
                }
            },
            {
                "promotion_id": "3704967819658673569",
                "product_id": "3704965330213405138",
                "title": "美式复古阔腿牛仔裤女2024新款水洗裂痕宽松不贴腿直筒微喇拖地裤",
                "cover": "https://p3-aio.ecombdimg.com/obj/ecom-shop-material/kQrOdkQo_m_89c051fb3439991fb60067f564c60a47_sx_725603_www800-800",
                "stock_num": 61048,
                "status": 2,
                "has_size_chart": true,
                "art_no": "7933",
                "warm_up": false,
                "is_kol_exclusive_channel_product": false,
                "channel_product_type": 3,
                "channel_stock_use_mode": 0,
                "channel_info": {
                    "channel_type": 0,
                    "channel_id": 0
                },
                "on_shelf_info": {
                    "can_show": false
                },
                "stock_info": {
                    "stock_num": 61048,
                    "can_show": true
                },
                "platform_label": "小店",
                "item_type": 4,
                "shop_id": "184464493",
                "tag_list": [
                    {
                        "type": 7
                    }
                ],
                "price_desc": {
                    "min_price": {
                        "origin": 5980,
                        "integer": "59",
                        "decimal": "8",
                        "suffix": ""
                    },
                    "price_text": "售价",
                    "max_price": {
                        "origin": 5980,
                        "integer": "59",
                        "decimal": "8",
                        "suffix": ""
                    }
                },
                "lottery_info": {
                    "is_lottery": false
                },
                "kol_exclusive_info": {
                    "exclusive_product": false
                },
                "exclusive_product_activity_type": 0,
                "platform_subsidy_price": 0,
                "can_seckill": false,
                "campaign_management": false,
                "in_exclusive_channel_activity": false,
                "price_level_info": {
                    "talent_price_level": {
                        "price_level": -1,
                        "price_level_desc": "",
                        "same_low_product_brief": null
                    }
                },
                "marketing_permission": {
                    "anchor_coupon_permission": false
                },
                "elastic_title": "",
                "has_prompt": false,
                "in_prompt": false,
                "has_recom_prompt": true,
                "online_room_operating_data": {
                    "pay_amt": 0,
                    "pay_combo_cnt": 0,
                    "show_ucnt": 0,
                    "click_ucnt": 0,
                    "create_ucnt": 0,
                    "pay_ucnt": 0
                },
                "stock_management": false,
                "product_card_info": {
                    "can_set_product_card": false
                }
            }
        ],
        "room_info": {
            "on_shelf_combination_num": 0,
            "cart_category_list": [
                {
                    "id": "0",
                    "name": "全部",
                    "type": 1
                },
                {
                    "id": "7553",
                    "name": "女装",
                    "type": 4
                }
            ]
        },
        "room_id": "0",
        "fetch_interval_config": {
            "promotion_info_fetch_interval": {
                "30": [
                    15,
                    414
                ],
                "60": [
                    3,
                    4,
                    8,
                    13,
                    409,
                    501
                ],
                "-1": [
                    101,
                    102,
                    201,
                    413,
                    415,
                    416,
                    504,
                    505,
                    508
                ],
                "300": [
                    16
                ],
                "4": [
                    11,
                    401,
                    402,
                    403,
                    404,
                    405
                ],
                "6": [
                    406,
                    407,
                    408
                ],
                "10": [
                    7,
                    9,
                    10,
                    12,
                    14,
                    301,
                    410,
                    411,
                    412,
                    502,
                    503,
                    507
                ],
                "2": [
                    5,
                    6,
                    506,
                    17
                ]
            }
        }
    }
}
```

请帮我写一个hook能获取到这个链接的返回的数据，记得不要重新发起请求，就使用hook的形式获取到，然后再帮我写一个列表页面，在点击这个插件的时候能弹出当前。有哪些商品然后加一个自动讲解的按钮