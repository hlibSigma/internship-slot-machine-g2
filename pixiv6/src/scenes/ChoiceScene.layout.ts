import {PartialLayout} from "app/layoutManager/LayoutManager";

class ChoiceSceneLayout {

    public readonly baseLayouts:PartialLayout[] = [{
        name: "item",
        uid: "item",
        width: "80%",
        height: "25%",
        scaleBy: "both",
        align: "c",
        alignIn: "c"
    }, {
        uid: "line",
        name: "line",
        width: "100%",
        height: "100%",
        sortBy: "vertical",
        aspects: {
            "1920/1935": {
                sortBy: "vertical",
            },
            "1920/2050": {
                sortBy: "horizontal",
            }
        },
    }, {
        name: "smallMiddleBox",
        uid: "smallMiddleBox",
        height: "80%",
        width: "80%",
        top: "10%",
        left: "10%",
    }];
    public readonly sceneLayout:PartialLayout = {
        name: "body",
        extend: "smallMiddleBox",
        sortBy: "vertical",
        display: "relative",

        layouts: [
            {
                name: "topPanel",
                height: "10%",
                width: "99%",
                top: "0.5%",
                left: "0.5%",
                layouts: [
                    {
                        name: "fsButton",
                        width: 100,
                        height: "80%",
                        left: -10,
                        scaleBy: "height",
                        align: "r",
                        alignIn: "r"
                    }
                ]
            },
            {
                name: "bottomBody",
                height: "99%",
                width: "99%",
                top: "0.5%",
                left: "0.5%",
                aspects: {
                    "1920/1935": {
                        sortBy: "horizontal",
                    },
                    "1920/2050": {
                        sortBy: "vertical",
                    }
                },
                layouts: [
                    {
                        name: "line1",
                        extend: "line",
                        layouts: [
                            {
                                name: "item1_1",
                                extend: "item",
                            },
                            {
                                name: "item1_2",
                                extend: "item",
                            },
                            {
                                name: "item1_3",
                                extend: "item",
                            }
                        ]
                    },
                    {
                        name: "line2",
                        extend: "line",
                        layouts: [
                            {
                                name: "item2_1",
                                extend: "item",
                            },
                            {
                                name: "item2_2",
                                extend: "item",
                            },
                            {
                                name: "item2_3",
                                extend: "item",
                            }
                        ]
                    },
                    {
                        name: "line2",
                        extend: "line",
                        layouts: [
                            {
                                name: "item3_1",
                                extend: "item",
                            },
                            {
                                name: "item3_2",
                                extend: "item",
                            },
                            {
                                name: "item3_3",
                                extend: "item",
                            }
                        ]
                    },
                    {
                        name: "line2",
                        extend: "line",
                        layouts: [
                            {
                                name: "item4_1",
                                extend: "item",
                            },
                            {
                                name: "item4_2",
                                extend: "item",
                            },
                            {
                                name: "item4_3",
                                extend: "item",
                            }
                        ]
                    },
                    {
                        name: "line2",
                        extend: "line",
                        layouts: [
                            {
                                name: "item5_1",
                                extend: "item",
                            },
                            {
                                name: "item5_2",
                                extend: "item",
                            },
                            {
                                name: "item5_3",
                                extend: "item",
                            }
                        ]
                    },
                    {
                        name: "line2",
                        extend: "line",
                        layouts: [
                            {
                                name: "item6_1",
                                extend: "item",
                            },
                            {
                                name: "item6_2",
                                extend: "item",
                            },
                            {
                                name: "item6_3",
                                extend: "item",
                            }
                        ]
                    },
                    {
                        name: "line2",
                        extend: "line",
                        layouts: [
                            {
                                name: "item7_1",
                                extend: "item",
                            },
                            {
                                name: "item7_2",
                                extend: "item",
                            },
                            {
                                name: "item7_3",
                                extend: "item",
                            }
                        ]
                    }
                ],
            }
        ]
    };

}
const choiceSceneLayout = new ChoiceSceneLayout();
export default choiceSceneLayout;