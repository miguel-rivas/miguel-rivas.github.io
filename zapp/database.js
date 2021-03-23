const user = {
    name: "Miguel",
    lastName: "Rivas",
    location: "Washington DC",
    codepen: "planetwurlex",
    github: "miguel-rivas",
};

const fullName = `${user.name} ${user.lastName}`;

const tool = {
    html,
    pug,
    haml,
    slim,
    css,
    sass,
    less,
    unity,
    rails,
    php,
    python,
    javascript,
    vue,
    angular,
    react,
    grunt,
    jQuery,
    json,
    miva,
    bootstrap,
    git,
    flash,
    illustrator,
    photoshop,
    indesign,
    afterEffect,
    premiere,
    inkscape,
};

const role = {
    design,
    frontend,
    animation,
};

const mode = {
    userFlow,
    wireFrame,
    app,
    prototype,
    landingPage,
    motionGraphic,
    animation3D,
    document,
}

const client = {
    presidente,
    drLogic,
    descubria,
    capitalDBG,
    miguelRivas,
    prototype,
    pepsi,
    redRock,
    itla,
    pixelPerfectTree,
    bprBank,
    voxel,
    orange,
};

const projects = [
    {
        date: "2014/06/02",
        title: "Destapa el Coro",
        url: "../docs/coroapp_ux.pdf",
        preview: "user-flow",
        externalLink: true,
        type: mode.userFlow,
        isVideo: false,
        role: [
            role.design,
        ],
        client: client.presidente,
        summary: [
            tool.illustrator,
        ]
    },{
        date: "2014/06/16",
        title: "Destapa el Coro",
        url: "../project/coroapp/",
        preview: "coroapp",
        externalLink: true,
        type: mode.app,
        isVideo: false,
        role: [
            role.frontend
        ],
        client: client.presidente,
        summary: [
            tool.html,
            tool.jQuery,
            tool.grunt,
            tool.css
        ]
    },{
        date: "2014/10/18",
        title: "Photo Assignmet",
        url: "../project/photo/",
        preview: "photo",
        externalLink: true,
        type: mode.app,
        isVideo: false,
        role: [
            role.frontend
        ],
        client: client.presidente,
        summary: [
            tool.html,
            tool.jQuery,
            tool.grunt,
            tool.css
        ]
    },{
        date: "2014/11/05",
        title: "Pronosticos",
        url: "../docs/pronosticos_ux.pdf",
        preview: "pronosticos",
        externalLink: true,
        type: mode.wireframe,
        isVideo: false,
        role: [
            role.design
        ],
        client: client.presidente,
        summary: [
            tool.illustrator
        ]
    },{
        date: "2015/03/24",
        title: "BigPapi Selfie",
        url: "https://player.vimeo.com/video/175240184",
        preview: "selfie",
        externalLink: true,
        type: mode.motionGraphic,
        isVideo: true,
        role: [
            role.animation
        ],
        client: client.pepsi,
        summary: [
            tool.flash
        ]
    },{
        date: "2015/04/18",
        title: "Carnaval Presidente",
        url: "presidente.html",
        preview: "presidente-carnaval",
        linkDirect: false,
        type: mode.landingPage,
        isVideo: false,
        role: [
            role.frontend
        ],
        client: client.presidente,
        summary: [
            tool.html,
            tool.jQuery,
            tool.grunt,
            tool.css,
            tool.php
        ]
    },{
        date: "2015/05/20",
        title: "Recarga Con RedRock",
        url: "https://player.vimeo.com/video/175240186",
        preview: "redrock",
        externalLink: true,
        type: mode.motionGraphic,
        isVideo: true,
        role: [
            role.animation
        ],
        client: client.redRock,
        summary: [
            tool.flash
        ]
    },{
        date: "2015/10/23",
        title: "Retrobrindis",
        url: "../project/retrobrindis",
        preview: "retrobrindis",
        externalLink: true,
        type: mode.app,
        isVideo: false,
        role: [
            role.frontend
        ],
        client: client.presidente,
        summary: [
            tool.html,
            tool.css,
            tool.jQuery,
            tool.php
        ]
    },{
        date: "2015/11/12",
        title: "Mineriza a tu Familia",
        url: "apap.html",
        preview: "apap-app",
        linkDirect: false,
        type: mode.app,
        isVideo: false,
        role: [
            role.frontend
        ],
        client: client.apap,
        summary: [
            tool.pug,
            tool.jQuery,
            tool.css
        ]
    },{
        date: "2015/12/16",
        title: "Verano Presidente",
        url: "../project/verano_filter/",
        preview: "filter",
        linkDirect: false,
        type: mode.prototype,
        isVideo: false,
        role: [
            role.frontend
        ],
        client: client.presidente,
        summary: [
            tool.html,
            tool.jQuery,
            tool.css
        ]
    },{
        date: "2015/12/16",
        title: "Presidente",
        url: "../project/aniversario_loader/",
        preview: "presidente-loader",
        externalLink: true,
        type: mode.prototype,
        isVideo: false,
        role: [
            role.frontend,role.design
        ],
        client: client.presidente,
        summary: [
            tool.html,
            tool.css
        ]
    },{
        date: "2016/02/18",
        title: "BPR Bank",
        url: "bpr.html",
        preview: "bpr",
        linkDirect: false,
        type: mode.app,
        isVideo: false,
        role: [
            role.frontend
        ],
        client: client.bprBank,
        summary: [
            tool.haml,
            tool.css,
            tool.jQuery,
            tool.bootstrap,
            tool.git,
            tool.rails
        ]
    },{
        date: "2016/02/22",
        title: "DrLogic",
        url: "drlogic.html",
        preview: "drlogic-home",
        linkDirect: false,
        type: mode.app,
        isVideo: false,
        role: [
            role.frontend
        ],
        client: client.drLogic,
        summary: [
            tool.haml,
            tool.css,
            tool.jQuery,
            tool.bootstrap,
            tool.git,
            tool.rails
        ]
    },{
        date: "2016/02/22",
        title: "DrLogic",
        url: "../project/drlogic/contact-us.html",
        preview: "drlogic-contact",
        linkDirect: false,
        type: mode.app,
        isVideo: false,
        role: [
            role.frontend
        ],
        client: client.drLogic,
        summary: [
            tool.haml,
            tool.css,
            tool.jQuery,
            tool.bootstrap,
            tool.git,
            tool.rails
        ]
    },{
        date: "2016/02/22",
        title: "DrLogic",
        url: "../project/drlogic/about-us.html",
        preview: "drlogic-about",
        linkDirect: false,
        type: mode.app,
        isVideo: false,
        role: [
            role.frontend
        ],
        client: client.drLogic,
        summary: [
            tool.haml,
            tool.css,
            tool.jQuery,
            tool.bootstrap,
            tool.git,
            tool.rails
        ]
    },{
        date: "2016/03/08",
        title: "DrLogic",
        url: "../project/drlogic/documents/terms.pdf",
        preview: "terms",
        externalLink: true,
        type: "Terms and Conditions",
        isVideo: false,
        role: [
            role.design
        ],
        client: client.drLogic,
        summary: [
            tool.indesign
        ]
    },{
        date: "2016/04/29",
        title: "DrLogic",
        url: "../project/drlogic/404.html",
        preview: "drlogic-404",
        externalLink: true,
        type: mode.prototype,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.drLogic,
        summary: [
            tool.haml,
            tool.css,
            tool.git,
            tool.illustrator,
            tool.rails
        ]
    },{
        date: "2016/06/16",
        title: "Pixel PT",
        url: "../project/pixelpt/404.html",
        preview: "ppt-404",
        externalLink: true,
        type: mode.prototype,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.pixelPerfectTree,
        summary: [
            tool.haml,
            tool.css,
            tool.git,
            tool.illustrator,
            tool.rails
        ]
    },{
        date: "2016/06/16",
        title: "Pixel PT",
        url: "../project/pixelpt/500.html",
        preview: "ppt-500",
        externalLink: true,
        type: mode.prototype,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.pixelPerfectTree,
        summary: [
            tool.haml,
            tool.css,
            tool.git,
            tool.illustrator,
            tool.rails
        ]
    },{
        date: "2016/06/30",
        title: "Voxel Cube Games",
        url: "../project/voxel",
        preview: "voxel",
        externalLink: true,
        type: mode.prototype,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.voxel,
        summary: [
            tool.haml,
            tool.css,
            tool.bootstrap,
            tool.git,
            tool.photoshop,
            tool.rails
        ]
    },
    // {
    // 	date: "2017/03/05",
    // 	title: "Art Direction",
    // 	externalLink: true,
    // 	type: "Portfolio",
    // 	url: "https://issuu.com/aguacatekun/docs/ptf2017",
    // 	preview: "portfolio"
    /
    // 	isVideo: false,
    // 	role: [
        // role.design,
    // ],
    // 	client: client.miguelRivas,
    // 	summary: [
    // 		tool.indesign,
    // 		tool.illustrator,
    // 		tool.photoshop
    // 	]
    // },
    {
        date: "2015/05/27",
        title: "Orange Reel",
        url: "https://player.vimeo.com/video/212177083",
        preview: "orange",
        externalLink: true,
        type: mode.motionGraphic,
        isVideo: true,
        role: [
            role.animation,
        ],
        client: client.orange,
        summary: [
            tool.flash
        ]
    },{
        date: "2016/01/29",
        title: "Shop.pr",
        url: "../docs/admin.pdf",
        preview: "shoppr",
        externalLink: true,
        type: mode.document,
        isVideo: false,
        role: [
            role.design,
        ],
        client: "Shop.pr",
        summary: [
            tool.illustrator
        ]
    },{
        date: "2016/06/24",
        title: "Voxel Cube Games",
        url: "../docs/voxel_social.pdf",
        preview: "vcg",
        externalLink: true,
        type: "Social Media",
        isVideo: false,
        role: [
            role.design,
        ],
        client: client.voxel,
        summary: [
            tool.photoshop,
            tool.illustrator,
        ]
    },
    // {
    // 	date: "2015/08/03",
    // 	title: "SIP",
    // 	externalLink: true,
    // 	type: "Website",
    // 	url: "http://socialinvestdr.com",
    // 	preview: "sip",
    // 	isVideo: false,
    // 	role: [
        // role.frontend,
    // ],
    // 	client: "SIP",
    // 	summary: [
    // 		tool.pug,
    // 		tool.css,
    // 		tool.jQuery,
    // 	]
    // },
    {
        date: "2015/10/28",
        title: "Pixel PT Test",
        url: "../cover/pixelpt/",
        preview: "pixeltest",
        externalLink: true,
        type: mode.landingPage,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.pixelPerfectTree,
        summary: [
            tool.pug,
            tool.sass,
            tool.jQuery,
            tool.illustrator
        ]
    },{
        date: "2014/01/14",
        title: "Descubria",
        url: "../project/park/",
        preview: "park",
        externalLink: true,
        type: client.app,
        isVideo: false,
        role: [
            role.frontend,
        ],
        client: client.descubria,
        summary: [
            tool.html,
            tool.css,
            tool.jQuery,
        ]
    },{
        date: "2014/08/06",
        title: "Bloqueo",
        url: "../project/capiblock/",
        preview: "capital",
        externalLink: true,
        type: mode.prototype,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.capitalDBG,
        summary: [
            tool.html,
            tool.css,
            tool.illustrator
        ]
    },{
        date: "2015/04/18",
        title: "Carnaval Presidente",
        url: "../project/carnaval_presidente_2015/filter.html",
        preview: "filtro_carnaval",
        type: client.prototype,
        externalLink: true,
        isVideo: false,
        role: [
            role.frontend,
        ],
        client: client.presidente,
        summary: [
            tool.html,
            tool.jQuery,
            tool.grunt,
            tool.css,
            tool.php
        ]
    },
    // {
    // 	date: "2017/09/20",
    // 	title: "Lemon Deal",
    // 	externalLink: true,
    // 	url: "https://www.planttherapy.com/2017/lemondeal",
    // 	preview: "planttherapy_lemon",
    // 	type: mode.landingPage,
    // 	isVideo: false,
    // 	role: [
        // role.frontend,
        // role.design
    // ],
    // 	client: "Plant Therapy",
    // 	summary: [
    // 		tool.html,
    // 		tool.miva,
    // 		tool.css,
    // 		tool.jQuery,
    // 		tool.illustrator
    // 	]
    // },
    {
        date: "2017/08/04",
        title: "Chakras",
        url: "../docs/wireframe_chakras.pdf",
        preview: "planttherapy_wf_chakras",
        externalLink: true,
        type: mode.wireframe,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: "Plant Therapy",
        summary: [
            tool.illustrator,
        ]
    },
    {
        date: "2015/01/03",
        title: "Mainfront",
        url: "../project/mainfront/",
        preview: "mainfront",
        type: mode.app,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.miguelRivas,
        summary: [
            tool.pug,
            tool.json,
            tool.jQuery,
            tool.grunt,
            tool.css,
            tool.illustrator,
        ]
    },{
        date: "2015/04/19",
        title: "CSS Study",
        url: "../project/css_properties/",
        preview: "CSS Study",
        type: mode.app,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.miguelRivas,
        summary: [
            tool.angular,
            "--Sweetalert",
            tool.json,
            tool.illustrator,
            tool.css,
            tool.pug,
        ]
    },{
        date: "2015/04/26",
        title: "Evolution Of The Web",
        url: "../project/timeline/",
        preview: "evolution",
        type: mode.app,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.miguelRivas,
        summary: [
            "--stellarJS",
            "--jQueryMouseWheel",
            "--CSS's SVG Animations",
            "--CSS's Keyframes",
            "--Horizontal Layout",
            tool.inkscape,
            tool.pug,
            "--HTML/Markdown",
            "--Wordpress",
        ],
    },
    // {
    // 	date: "2015/05/10",
    // 	title: "Bootstrap Prototype",
    // 	url: "../project/quack/",
    // 	preview: "quack"
    // 	type: mode.landingPage,
    // 	isVideo: false,
    // 	role: [
        // role.frontend,
        // role.design,
    // ],
    // 	client: client.miguelRivas,
    // 	summary: [
    // 		"--Bootstrap",
    // 		"--Responsive Design",
    // 		tool.pug,
    // 		tool.illustrator
    // 	]
    // },
    {
        date: "2015/05/14",
        title: "Screen",
        url: "http://codepen.io/casperu/pen/oXxPvw",
        preview: "screen",
        type: mode.prototype,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.miguelRivas,
        summary: [
            "--HTML's Bones Structure",
            "--CSS's Hover Animations",
            "--CSS's Keyframes",
            "--SASS's Variables",
            "--SASS's Mixings",
            tool.pug,
            tool.css,
            tool.illustrator,
        ]
    },{
        date: "2015/05/23",
        title: "Mini Van",
        url: "https://codepen.io/casperu/pen/VLKNBz",
        preview: "bus",
        type: mode.prototype,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.miguelRivas,
        summary: [
            "--CSS's Drawings",
            "--CSS's Hover Animations",
            "--CSS's Keyframes",
            "--SASS's Variables",
            tool.pug,
            tool.css,
            "--SASS's Mixings",
        ]
    },{
        date: "2015/05/25",
        title: "Windows Form",
        url: "http://codepen.io/casperu/pen/PqbqpL",
        preview: "windowsform",
        type: mode.prototype,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.miguelRivas,
        summary: [
            "--CSS's 3d Transforms",
            "--CSS's 3d Perspective",
            "--CSS's Hover Animations",
            "--CSS's Drawings",
            "--SASS's Variables",
            "--SASS's Mixings",
            "--Jade's Variables",
            "--Jade's Mixings",
            tool.illustrator,
        ]
    },{
        date: "2015/05/28",
        title: "Gear",
        url: "https://codepen.io/casperu/pen/yNJJpG",
        preview: "gear",
        type: mode.prototype,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.miguelRivas,
        summary: [
            "--Canvas",
            tool.pug,
            tool.css,
        ]
    },{
        date: "2015/12/07",
        title: "SVG 101",
        url: "../project/svg_101/",
        preview: "svg",
        type: mode.prototype,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.miguelRivas,
        summary: [
            "--jQueryMouseWheel",
            "--stellarJS",
            "--snapSVG",
            "--SVG Animations",
            "--Horizontal Layout",
            tool.pug,
            tool.css,
            tool.illustrator,
        ]
    },{
        date: "2015/12/22",
        title: "Tetravex",
        url: "../project/tetravex/",
        preview: "tetravex",
        type: mode.app,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.miguelRivas,
        summary: [
            tool.javascript,
            tool.pug,
            tool.css,
            "--Modular Javascript",
            "--Sizzle",
            "--Lodash",
            "--Velocity.js",
            tool.illustrator,
            tool.inkscape,
        ]
    },
    // {
    // 	date: "2016/01/11",
    // 	title: "HTML/LOVE",
    // 	type: mode.landingPage,
    // 	url: "../project/html-love/",
    // 	preview: "htmllove",
    // 	isVideo: false,
    // 	role: [
        // role.frontend,
        // role.design,
    // ],
    // 	client: client.miguelRivas,
    // 	summary: [
    // 		"--HTML/HAML",
    // 		tool.css,
    // 		"--Animate.css",
    // 		"--CSS's Hover Animations",
    // 		"--CSS's Keyframes",
    // 		"--SASS's Variables",
    // 		"--SASS's Mixings",
    // 		tool.illustrator
    // 	]
    // },
    {
        date: "2017/01/01",
        title: "FlatCSS",
        url: "https://casperwurlex.github.io/flatCSS/",
        preview: "flatcss",
        type: mode.landingPage,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.miguelRivas,
        summary: [
            tool.pug,
            tool.css,
            tool.git,
        ]
    },{
        date: "2017/02/20",
        title: "Pills",
        url: "http://codepen.io/casperu/pen/qRzzmz",
        preview: "pills",
        type: mode.prototype,
        isVideo: false,
        role: [
            role.frontend,
            role.design,
        ],
        client: client.miguelRivas,
        summary: [
            tool.slim,
            tool.css,
            "--CSS's Drawings",
            "--CSS's Hover Animations",
            "--CSS's Keyframes",
        ]
    },{
        date: "2017/04/04",
        title: "Mineriza a tu Familia",
        url: "https://player.vimeo.com/video/211801157",
        preview: "apap",
        type: mode.motionGraphic,
        isVideo: true,
        role: [
            role.animation,
        ],
        client: client.apap,
        summary: [
            tool.afterEffect,
            tool.premiere,
        ]
    },
    // {
    // 	date: "2012/09/26",
    // 	title: "Tips of Design",
    // 	type: "Book",
    // 	url: "https://issuu.com/aguacatekun/docs/t10",
    // 	preview: "tips",
    // 	isVideo: false,
    // 	role: [
        // role.design,
    // ],
    // 	client: client.miguelRivas,
    // 	summary: [
    // 		tool.indesign,
    // 	]
    // },
    {
        date: "2010/07/07",
        title: "Walking",
        url: "https://player.vimeo.com/video/224945169",
        preview: "walking",
        type: mode.motionGraphic,
        isVideo: true,
        role: [
            role.animation,
            role.design,
        ],
        client: client.itla,
        summary: [
            tool.flash,
        ]
    },{
        date: "2012/07/22",
        title: "La Guerra de Vectores",
        url: "https://player.vimeo.com/video/175240185",
        preview: "guerra",
        type: mode.motionGraphic,
        isVideo: true,
        role: [
            role.animation,
        ],
        client: client.itla,
        summary: [
            tool.flash,
        ]
    },{
        date: "2016/11/21",
        title: "Wurlex",
        url: "https://player.vimeo.com/video/224977703",
        preview: "wurlex",
        type: mode.animation3D,
        isVideo: true,
        role: [
            role.animation,role.design
        ],
        client: client.miguelRivas,
        summary: [
            tool.unity,
            tool.premiere
        ]
    },{
        date: "2014/03/22",
        title: "Screens",
        url: "../portfolio_2014/",
        preview: "screens",
        type: mode.app,
        isVideo: false,
        role: [
            role.design,
            role.frontend,
        ],
        client: client.miguelRivas,
        summary: [
            tool.pug,
            tool.sass,
            tool.jQuery,
            tool.php,
        ]
    },{
        date: "2016/08/11",
        title: "Monster",
        url: "../portfolio_2016/",
        preview: "monster",
        type: mode.app,
        isVideo: false,
        role: [
            role.design,
            role.frontend,
        ],
        client: client.miguelRivas,
        summary: [
            tool.pug,
            tool.sass,
            tool.jQuery,
            tool.php,
        ]
    }
];