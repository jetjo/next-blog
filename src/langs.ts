
const programLangs = ({
    js: {
        reg: /^(jsx?|[mc]js)$/img,
        label: "Javascript",
        type: "Program",
        lang: "js",
        isActive: true
    },
    jsx: {
        reg: /^(jsx?|[mc]js)$/img,
        label: "Javascript",
        type: "Program",
        lang: "jsx",
        isActive: true
    },
    mjs: {
        reg: /^(jsx?|[mc]js)$/img,
        label: "Javascript",
        type: "Program",
        lang: "mjs",
        isActive: true
    },
    cjs: {
        reg: /^(jsx?|[mc]js)$/img,
        label: "Javascript",
        type: "Program",
        lang: "cjs",
        isActive: true
    },
    ts: {
        reg: /^(tsx?|[mc]ts)$/i,
        label: "Typescript",
        type: "Program",
        lang: "ts",
        isActive: false
    },
    tsx: {
        reg: /^(tsx?|[mc]ts)$/i,
        label: "Typescript",
        type: "Program",
        lang: "tsx",
        isActive: false
    },
    mts: {
        reg: /^(tsx?|[mc]ts)$/i,
        label: "Typescript",
        type: "Program",
        lang: "mts",
        isActive: false
    },
    cts: {
        reg: /^(tsx?|[mc]ts)$/i,
        label: "Typescript",
        type: "Program",
        lang: "cts",
        isActive: false
    },
    css: {
        reg: /^css$/i,
        label: "CSS",
        type: "Style",
        lang: "css",
        isActive: true
    },
    less: {
        reg: /^less$/i,
        label: "Less",
        type: "Style",
        lang: "less",
        isActive: false
    },
    scss: {
        reg: /^s[ac]ss$/i,
        label: "Sass",
        type: "Style",
        lang: "scss",
        isActive: false
    },
    sass: {
        reg: /^s[ac]ss$/i,
        label: "Sass",
        type: "Style",
        lang: "sass",
        isActive: false
    },
    styl: {
        reg: /^styl$/i,
        label: "Stylus",
        type: "Style",
        lang: "styl",
        isActive: false
    },
    html: {
        reg: /^html?$/i,
        label: "HTML",
        type: "Template",
        lang: "html",
        isActive: true
    },
    htm: {
        reg: /^html?$/i,
        label: "HTML",
        type: "Template",
        lang: "htm",
        isActive: true
    },
    pug: {
        reg: /^pug$/i,
        label: "Pug",
        type: "Template",
        lang: "pug",
        isActive: false
    },
    ejs: {
        reg: /^ejs$/i,
        label: "EJS",
        type: "Template",
        lang: "ejs",
        isActive: false
    },
    sh: {
        reg: /^(sh|zsh|bash)$/i,
        label: "Bash",
        type: "CLI",
        lang: "sh",
        isActive: true
    },
    zsh: {
        reg: /^(sh|zsh|bash)$/i,
        label: "Bash",
        type: "CLI",
        lang: "zsh",
        isActive: true
    },
    bash: {
        reg: /^(sh|zsh|bash)$/i,
        label: "Bash",
        type: "CLI",
        lang: "bash",
        isActive: true
    },
    bat: {
        reg: /^(bat|cmd)$/i,
        label: "Cmd",
        type: "CLI",
        lang: "bat",
        isActive: false
    },
    cmd: {
        reg: /^(bat|cmd)$/i,
        label: "Cmd",
        type: "CLI",
        lang: "cmd",
        isActive: false
    },
    ps1: {
        reg: /^ps1$/i,
        label: "PowerShell",
        type: "CLI",
        lang: "ps1",
        isActive: false
    }
} as const);

const programLabels = ({
    Javascript: {
        reg: /^(jsx?|[mc]js)$/img,
        label: "Javascript",
        type: "Program",
        langs: [
            "js",
            "jsx",
            "mjs",
            "cjs"
        ],
        langMap: {
            js: {
                reg: /^(jsx?|[mc]js)$/img,
                label: "Javascript",
                type: "Program",
                lang: "js",
                isActive: true
            },
            jsx: {
                reg: /^(jsx?|[mc]js)$/img,
                label: "Javascript",
                type: "Program",
                lang: "jsx",
                isActive: true
            },
            mjs: {
                reg: /^(jsx?|[mc]js)$/img,
                label: "Javascript",
                type: "Program",
                lang: "mjs",
                isActive: true
            },
            cjs: {
                reg: /^(jsx?|[mc]js)$/img,
                label: "Javascript",
                type: "Program",
                lang: "cjs",
                isActive: true
            }
        },
        langArr: [
            {
                reg: /^(jsx?|[mc]js)$/img,
                label: "Javascript",
                type: "Program",
                lang: "js",
                isActive: true
            },
            {
                reg: /^(jsx?|[mc]js)$/img,
                label: "Javascript",
                type: "Program",
                lang: "jsx",
                isActive: true
            },
            {
                reg: /^(jsx?|[mc]js)$/img,
                label: "Javascript",
                type: "Program",
                lang: "mjs",
                isActive: true
            },
            {
                reg: /^(jsx?|[mc]js)$/img,
                label: "Javascript",
                type: "Program",
                lang: "cjs",
                isActive: true
            }
        ],
        isActive: true
    },
    Typescript: {
        reg: /^(tsx?|[mc]ts)$/i,
        label: "Typescript",
        type: "Program",
        langs: [
            "ts",
            "tsx",
            "mts",
            "cts"
        ],
        langMap: {
            ts: {
                reg: /^(tsx?|[mc]ts)$/i,
                label: "Typescript",
                type: "Program",
                lang: "ts",
                isActive: false
            },
            tsx: {
                reg: /^(tsx?|[mc]ts)$/i,
                label: "Typescript",
                type: "Program",
                lang: "tsx",
                isActive: false
            },
            mts: {
                reg: /^(tsx?|[mc]ts)$/i,
                label: "Typescript",
                type: "Program",
                lang: "mts",
                isActive: false
            },
            cts: {
                reg: /^(tsx?|[mc]ts)$/i,
                label: "Typescript",
                type: "Program",
                lang: "cts",
                isActive: false
            }
        },
        langArr: [
            {
                reg: /^(tsx?|[mc]ts)$/i,
                label: "Typescript",
                type: "Program",
                lang: "ts",
                isActive: false
            },
            {
                reg: /^(tsx?|[mc]ts)$/i,
                label: "Typescript",
                type: "Program",
                lang: "tsx",
                isActive: false
            },
            {
                reg: /^(tsx?|[mc]ts)$/i,
                label: "Typescript",
                type: "Program",
                lang: "mts",
                isActive: false
            },
            {
                reg: /^(tsx?|[mc]ts)$/i,
                label: "Typescript",
                type: "Program",
                lang: "cts",
                isActive: false
            }
        ],
        isActive: false
    },
    CSS: {
        reg: /^css$/i,
        label: "CSS",
        type: "Style",
        langs: [
            "css"
        ],
        langMap: {
            css: {
                reg: /^css$/i,
                label: "CSS",
                type: "Style",
                lang: "css",
                isActive: true
            }
        },
        langArr: [
            {
                reg: /^css$/i,
                label: "CSS",
                type: "Style",
                lang: "css",
                isActive: true
            }
        ],
        isActive: true
    },
    Less: {
        reg: /^less$/i,
        label: "Less",
        type: "Style",
        langs: [
            "less"
        ],
        langMap: {
            less: {
                reg: /^less$/i,
                label: "Less",
                type: "Style",
                lang: "less",
                isActive: false
            }
        },
        langArr: [
            {
                reg: /^less$/i,
                label: "Less",
                type: "Style",
                lang: "less",
                isActive: false
            }
        ],
        isActive: false
    },
    Sass: {
        reg: /^s[ac]ss$/i,
        label: "Sass",
        type: "Style",
        langs: [
            "scss",
            "sass"
        ],
        langMap: {
            scss: {
                reg: /^s[ac]ss$/i,
                label: "Sass",
                type: "Style",
                lang: "scss",
                isActive: false
            },
            sass: {
                reg: /^s[ac]ss$/i,
                label: "Sass",
                type: "Style",
                lang: "sass",
                isActive: false
            }
        },
        langArr: [
            {
                reg: /^s[ac]ss$/i,
                label: "Sass",
                type: "Style",
                lang: "scss",
                isActive: false
            },
            {
                reg: /^s[ac]ss$/i,
                label: "Sass",
                type: "Style",
                lang: "sass",
                isActive: false
            }
        ],
        isActive: false
    },
    Stylus: {
        reg: /^styl$/i,
        label: "Stylus",
        type: "Style",
        langs: [
            "styl"
        ],
        langMap: {
            styl: {
                reg: /^styl$/i,
                label: "Stylus",
                type: "Style",
                lang: "styl",
                isActive: false
            }
        },
        langArr: [
            {
                reg: /^styl$/i,
                label: "Stylus",
                type: "Style",
                lang: "styl",
                isActive: false
            }
        ],
        isActive: false
    },
    HTML: {
        reg: /^html?$/i,
        label: "HTML",
        type: "Template",
        langs: [
            "html",
            "htm"
        ],
        langMap: {
            html: {
                reg: /^html?$/i,
                label: "HTML",
                type: "Template",
                lang: "html",
                isActive: true
            },
            htm: {
                reg: /^html?$/i,
                label: "HTML",
                type: "Template",
                lang: "htm",
                isActive: true
            }
        },
        langArr: [
            {
                reg: /^html?$/i,
                label: "HTML",
                type: "Template",
                lang: "html",
                isActive: true
            },
            {
                reg: /^html?$/i,
                label: "HTML",
                type: "Template",
                lang: "htm",
                isActive: true
            }
        ],
        isActive: true
    },
    Pug: {
        reg: /^pug$/i,
        label: "Pug",
        type: "Template",
        langs: [
            "pug"
        ],
        langMap: {
            pug: {
                reg: /^pug$/i,
                label: "Pug",
                type: "Template",
                lang: "pug",
                isActive: false
            }
        },
        langArr: [
            {
                reg: /^pug$/i,
                label: "Pug",
                type: "Template",
                lang: "pug",
                isActive: false
            }
        ],
        isActive: false
    },
    EJS: {
        reg: /^ejs$/i,
        label: "EJS",
        type: "Template",
        langs: [
            "ejs"
        ],
        langMap: {
            ejs: {
                reg: /^ejs$/i,
                label: "EJS",
                type: "Template",
                lang: "ejs",
                isActive: false
            }
        },
        langArr: [
            {
                reg: /^ejs$/i,
                label: "EJS",
                type: "Template",
                lang: "ejs",
                isActive: false
            }
        ],
        isActive: false
    },
    Bash: {
        reg: /^(sh|zsh|bash)$/i,
        label: "Bash",
        type: "CLI",
        langs: [
            "sh",
            "zsh",
            "bash"
        ],
        langMap: {
            sh: {
                reg: /^(sh|zsh|bash)$/i,
                label: "Bash",
                type: "CLI",
                lang: "sh",
                isActive: true
            },
            zsh: {
                reg: /^(sh|zsh|bash)$/i,
                label: "Bash",
                type: "CLI",
                lang: "zsh",
                isActive: true
            },
            bash: {
                reg: /^(sh|zsh|bash)$/i,
                label: "Bash",
                type: "CLI",
                lang: "bash",
                isActive: true
            }
        },
        langArr: [
            {
                reg: /^(sh|zsh|bash)$/i,
                label: "Bash",
                type: "CLI",
                lang: "sh",
                isActive: true
            },
            {
                reg: /^(sh|zsh|bash)$/i,
                label: "Bash",
                type: "CLI",
                lang: "zsh",
                isActive: true
            },
            {
                reg: /^(sh|zsh|bash)$/i,
                label: "Bash",
                type: "CLI",
                lang: "bash",
                isActive: true
            }
        ],
        isActive: true
    },
    Cmd: {
        reg: /^(bat|cmd)$/i,
        label: "Cmd",
        type: "CLI",
        langs: [
            "bat",
            "cmd"
        ],
        langMap: {
            bat: {
                reg: /^(bat|cmd)$/i,
                label: "Cmd",
                type: "CLI",
                lang: "bat",
                isActive: false
            },
            cmd: {
                reg: /^(bat|cmd)$/i,
                label: "Cmd",
                type: "CLI",
                lang: "cmd",
                isActive: false
            }
        },
        langArr: [
            {
                reg: /^(bat|cmd)$/i,
                label: "Cmd",
                type: "CLI",
                lang: "bat",
                isActive: false
            },
            {
                reg: /^(bat|cmd)$/i,
                label: "Cmd",
                type: "CLI",
                lang: "cmd",
                isActive: false
            }
        ],
        isActive: false
    },
    PowerShell: {
        reg: /^ps1$/i,
        label: "PowerShell",
        type: "CLI",
        langs: [
            "ps1"
        ],
        langMap: {
            ps1: {
                reg: /^ps1$/i,
                label: "PowerShell",
                type: "CLI",
                lang: "ps1",
                isActive: false
            }
        },
        langArr: [
            {
                reg: /^ps1$/i,
                label: "PowerShell",
                type: "CLI",
                lang: "ps1",
                isActive: false
            }
        ],
        isActive: false
    }
} as const);

const programTypes = ({
    Program: {
        labels: [
            "Javascript",
            "Typescript"
        ],
        labelMap: {
            Javascript: {
                reg: /^(jsx?|[mc]js)$/img,
                label: "Javascript",
                type: "Program",
                langs: [
                    "js",
                    "jsx",
                    "mjs",
                    "cjs"
                ],
                langMap: {
                    js: {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "js",
                        isActive: true
                    },
                    jsx: {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "jsx",
                        isActive: true
                    },
                    mjs: {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "mjs",
                        isActive: true
                    },
                    cjs: {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "cjs",
                        isActive: true
                    }
                },
                langArr: [
                    {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "js",
                        isActive: true
                    },
                    {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "jsx",
                        isActive: true
                    },
                    {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "mjs",
                        isActive: true
                    },
                    {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "cjs",
                        isActive: true
                    }
                ],
                isActive: true
            },
            Typescript: {
                reg: /^(tsx?|[mc]ts)$/i,
                label: "Typescript",
                type: "Program",
                langs: [
                    "ts",
                    "tsx",
                    "mts",
                    "cts"
                ],
                langMap: {
                    ts: {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "ts",
                        isActive: false
                    },
                    tsx: {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "tsx",
                        isActive: false
                    },
                    mts: {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "mts",
                        isActive: false
                    },
                    cts: {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "cts",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "ts",
                        isActive: false
                    },
                    {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "tsx",
                        isActive: false
                    },
                    {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "mts",
                        isActive: false
                    },
                    {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "cts",
                        isActive: false
                    }
                ],
                isActive: false
            }
        },
        labelArr: [
            {
                reg: /^(jsx?|[mc]js)$/img,
                label: "Javascript",
                type: "Program",
                langs: [
                    "js",
                    "jsx",
                    "mjs",
                    "cjs"
                ],
                langMap: {
                    js: {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "js",
                        isActive: true
                    },
                    jsx: {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "jsx",
                        isActive: true
                    },
                    mjs: {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "mjs",
                        isActive: true
                    },
                    cjs: {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "cjs",
                        isActive: true
                    }
                },
                langArr: [
                    {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "js",
                        isActive: true
                    },
                    {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "jsx",
                        isActive: true
                    },
                    {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "mjs",
                        isActive: true
                    },
                    {
                        reg: /^(jsx?|[mc]js)$/img,
                        label: "Javascript",
                        type: "Program",
                        lang: "cjs",
                        isActive: true
                    }
                ],
                isActive: true
            },
            {
                reg: /^(tsx?|[mc]ts)$/i,
                label: "Typescript",
                type: "Program",
                langs: [
                    "ts",
                    "tsx",
                    "mts",
                    "cts"
                ],
                langMap: {
                    ts: {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "ts",
                        isActive: false
                    },
                    tsx: {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "tsx",
                        isActive: false
                    },
                    mts: {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "mts",
                        isActive: false
                    },
                    cts: {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "cts",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "ts",
                        isActive: false
                    },
                    {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "tsx",
                        isActive: false
                    },
                    {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "mts",
                        isActive: false
                    },
                    {
                        reg: /^(tsx?|[mc]ts)$/i,
                        label: "Typescript",
                        type: "Program",
                        lang: "cts",
                        isActive: false
                    }
                ],
                isActive: false
            }
        ]
    },
    Style: {
        labels: [
            "CSS",
            "Less",
            "Sass",
            "Stylus"
        ],
        labelMap: {
            CSS: {
                reg: /^css$/i,
                label: "CSS",
                type: "Style",
                langs: [
                    "css"
                ],
                langMap: {
                    css: {
                        reg: /^css$/i,
                        label: "CSS",
                        type: "Style",
                        lang: "css",
                        isActive: true
                    }
                },
                langArr: [
                    {
                        reg: /^css$/i,
                        label: "CSS",
                        type: "Style",
                        lang: "css",
                        isActive: true
                    }
                ],
                isActive: true
            },
            Less: {
                reg: /^less$/i,
                label: "Less",
                type: "Style",
                langs: [
                    "less"
                ],
                langMap: {
                    less: {
                        reg: /^less$/i,
                        label: "Less",
                        type: "Style",
                        lang: "less",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^less$/i,
                        label: "Less",
                        type: "Style",
                        lang: "less",
                        isActive: false
                    }
                ],
                isActive: false
            },
            Sass: {
                reg: /^s[ac]ss$/i,
                label: "Sass",
                type: "Style",
                langs: [
                    "scss",
                    "sass"
                ],
                langMap: {
                    scss: {
                        reg: /^s[ac]ss$/i,
                        label: "Sass",
                        type: "Style",
                        lang: "scss",
                        isActive: false
                    },
                    sass: {
                        reg: /^s[ac]ss$/i,
                        label: "Sass",
                        type: "Style",
                        lang: "sass",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^s[ac]ss$/i,
                        label: "Sass",
                        type: "Style",
                        lang: "scss",
                        isActive: false
                    },
                    {
                        reg: /^s[ac]ss$/i,
                        label: "Sass",
                        type: "Style",
                        lang: "sass",
                        isActive: false
                    }
                ],
                isActive: false
            },
            Stylus: {
                reg: /^styl$/i,
                label: "Stylus",
                type: "Style",
                langs: [
                    "styl"
                ],
                langMap: {
                    styl: {
                        reg: /^styl$/i,
                        label: "Stylus",
                        type: "Style",
                        lang: "styl",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^styl$/i,
                        label: "Stylus",
                        type: "Style",
                        lang: "styl",
                        isActive: false
                    }
                ],
                isActive: false
            }
        },
        labelArr: [
            {
                reg: /^css$/i,
                label: "CSS",
                type: "Style",
                langs: [
                    "css"
                ],
                langMap: {
                    css: {
                        reg: /^css$/i,
                        label: "CSS",
                        type: "Style",
                        lang: "css",
                        isActive: true
                    }
                },
                langArr: [
                    {
                        reg: /^css$/i,
                        label: "CSS",
                        type: "Style",
                        lang: "css",
                        isActive: true
                    }
                ],
                isActive: true
            },
            {
                reg: /^less$/i,
                label: "Less",
                type: "Style",
                langs: [
                    "less"
                ],
                langMap: {
                    less: {
                        reg: /^less$/i,
                        label: "Less",
                        type: "Style",
                        lang: "less",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^less$/i,
                        label: "Less",
                        type: "Style",
                        lang: "less",
                        isActive: false
                    }
                ],
                isActive: false
            },
            {
                reg: /^s[ac]ss$/i,
                label: "Sass",
                type: "Style",
                langs: [
                    "scss",
                    "sass"
                ],
                langMap: {
                    scss: {
                        reg: /^s[ac]ss$/i,
                        label: "Sass",
                        type: "Style",
                        lang: "scss",
                        isActive: false
                    },
                    sass: {
                        reg: /^s[ac]ss$/i,
                        label: "Sass",
                        type: "Style",
                        lang: "sass",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^s[ac]ss$/i,
                        label: "Sass",
                        type: "Style",
                        lang: "scss",
                        isActive: false
                    },
                    {
                        reg: /^s[ac]ss$/i,
                        label: "Sass",
                        type: "Style",
                        lang: "sass",
                        isActive: false
                    }
                ],
                isActive: false
            },
            {
                reg: /^styl$/i,
                label: "Stylus",
                type: "Style",
                langs: [
                    "styl"
                ],
                langMap: {
                    styl: {
                        reg: /^styl$/i,
                        label: "Stylus",
                        type: "Style",
                        lang: "styl",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^styl$/i,
                        label: "Stylus",
                        type: "Style",
                        lang: "styl",
                        isActive: false
                    }
                ],
                isActive: false
            }
        ]
    },
    Template: {
        labels: [
            "HTML",
            "Pug",
            "EJS"
        ],
        labelMap: {
            HTML: {
                reg: /^html?$/i,
                label: "HTML",
                type: "Template",
                langs: [
                    "html",
                    "htm"
                ],
                langMap: {
                    html: {
                        reg: /^html?$/i,
                        label: "HTML",
                        type: "Template",
                        lang: "html",
                        isActive: true
                    },
                    htm: {
                        reg: /^html?$/i,
                        label: "HTML",
                        type: "Template",
                        lang: "htm",
                        isActive: true
                    }
                },
                langArr: [
                    {
                        reg: /^html?$/i,
                        label: "HTML",
                        type: "Template",
                        lang: "html",
                        isActive: true
                    },
                    {
                        reg: /^html?$/i,
                        label: "HTML",
                        type: "Template",
                        lang: "htm",
                        isActive: true
                    }
                ],
                isActive: true
            },
            Pug: {
                reg: /^pug$/i,
                label: "Pug",
                type: "Template",
                langs: [
                    "pug"
                ],
                langMap: {
                    pug: {
                        reg: /^pug$/i,
                        label: "Pug",
                        type: "Template",
                        lang: "pug",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^pug$/i,
                        label: "Pug",
                        type: "Template",
                        lang: "pug",
                        isActive: false
                    }
                ],
                isActive: false
            },
            EJS: {
                reg: /^ejs$/i,
                label: "EJS",
                type: "Template",
                langs: [
                    "ejs"
                ],
                langMap: {
                    ejs: {
                        reg: /^ejs$/i,
                        label: "EJS",
                        type: "Template",
                        lang: "ejs",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^ejs$/i,
                        label: "EJS",
                        type: "Template",
                        lang: "ejs",
                        isActive: false
                    }
                ],
                isActive: false
            }
        },
        labelArr: [
            {
                reg: /^html?$/i,
                label: "HTML",
                type: "Template",
                langs: [
                    "html",
                    "htm"
                ],
                langMap: {
                    html: {
                        reg: /^html?$/i,
                        label: "HTML",
                        type: "Template",
                        lang: "html",
                        isActive: true
                    },
                    htm: {
                        reg: /^html?$/i,
                        label: "HTML",
                        type: "Template",
                        lang: "htm",
                        isActive: true
                    }
                },
                langArr: [
                    {
                        reg: /^html?$/i,
                        label: "HTML",
                        type: "Template",
                        lang: "html",
                        isActive: true
                    },
                    {
                        reg: /^html?$/i,
                        label: "HTML",
                        type: "Template",
                        lang: "htm",
                        isActive: true
                    }
                ],
                isActive: true
            },
            {
                reg: /^pug$/i,
                label: "Pug",
                type: "Template",
                langs: [
                    "pug"
                ],
                langMap: {
                    pug: {
                        reg: /^pug$/i,
                        label: "Pug",
                        type: "Template",
                        lang: "pug",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^pug$/i,
                        label: "Pug",
                        type: "Template",
                        lang: "pug",
                        isActive: false
                    }
                ],
                isActive: false
            },
            {
                reg: /^ejs$/i,
                label: "EJS",
                type: "Template",
                langs: [
                    "ejs"
                ],
                langMap: {
                    ejs: {
                        reg: /^ejs$/i,
                        label: "EJS",
                        type: "Template",
                        lang: "ejs",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^ejs$/i,
                        label: "EJS",
                        type: "Template",
                        lang: "ejs",
                        isActive: false
                    }
                ],
                isActive: false
            }
        ]
    },
    CLI: {
        labels: [
            "Bash",
            "Cmd",
            "PowerShell"
        ],
        labelMap: {
            Bash: {
                reg: /^(sh|zsh|bash)$/i,
                label: "Bash",
                type: "CLI",
                langs: [
                    "sh",
                    "zsh",
                    "bash"
                ],
                langMap: {
                    sh: {
                        reg: /^(sh|zsh|bash)$/i,
                        label: "Bash",
                        type: "CLI",
                        lang: "sh",
                        isActive: true
                    },
                    zsh: {
                        reg: /^(sh|zsh|bash)$/i,
                        label: "Bash",
                        type: "CLI",
                        lang: "zsh",
                        isActive: true
                    },
                    bash: {
                        reg: /^(sh|zsh|bash)$/i,
                        label: "Bash",
                        type: "CLI",
                        lang: "bash",
                        isActive: true
                    }
                },
                langArr: [
                    {
                        reg: /^(sh|zsh|bash)$/i,
                        label: "Bash",
                        type: "CLI",
                        lang: "sh",
                        isActive: true
                    },
                    {
                        reg: /^(sh|zsh|bash)$/i,
                        label: "Bash",
                        type: "CLI",
                        lang: "zsh",
                        isActive: true
                    },
                    {
                        reg: /^(sh|zsh|bash)$/i,
                        label: "Bash",
                        type: "CLI",
                        lang: "bash",
                        isActive: true
                    }
                ],
                isActive: true
            },
            Cmd: {
                reg: /^(bat|cmd)$/i,
                label: "Cmd",
                type: "CLI",
                langs: [
                    "bat",
                    "cmd"
                ],
                langMap: {
                    bat: {
                        reg: /^(bat|cmd)$/i,
                        label: "Cmd",
                        type: "CLI",
                        lang: "bat",
                        isActive: false
                    },
                    cmd: {
                        reg: /^(bat|cmd)$/i,
                        label: "Cmd",
                        type: "CLI",
                        lang: "cmd",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^(bat|cmd)$/i,
                        label: "Cmd",
                        type: "CLI",
                        lang: "bat",
                        isActive: false
                    },
                    {
                        reg: /^(bat|cmd)$/i,
                        label: "Cmd",
                        type: "CLI",
                        lang: "cmd",
                        isActive: false
                    }
                ],
                isActive: false
            },
            PowerShell: {
                reg: /^ps1$/i,
                label: "PowerShell",
                type: "CLI",
                langs: [
                    "ps1"
                ],
                langMap: {
                    ps1: {
                        reg: /^ps1$/i,
                        label: "PowerShell",
                        type: "CLI",
                        lang: "ps1",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^ps1$/i,
                        label: "PowerShell",
                        type: "CLI",
                        lang: "ps1",
                        isActive: false
                    }
                ],
                isActive: false
            }
        },
        labelArr: [
            {
                reg: /^(sh|zsh|bash)$/i,
                label: "Bash",
                type: "CLI",
                langs: [
                    "sh",
                    "zsh",
                    "bash"
                ],
                langMap: {
                    sh: {
                        reg: /^(sh|zsh|bash)$/i,
                        label: "Bash",
                        type: "CLI",
                        lang: "sh",
                        isActive: true
                    },
                    zsh: {
                        reg: /^(sh|zsh|bash)$/i,
                        label: "Bash",
                        type: "CLI",
                        lang: "zsh",
                        isActive: true
                    },
                    bash: {
                        reg: /^(sh|zsh|bash)$/i,
                        label: "Bash",
                        type: "CLI",
                        lang: "bash",
                        isActive: true
                    }
                },
                langArr: [
                    {
                        reg: /^(sh|zsh|bash)$/i,
                        label: "Bash",
                        type: "CLI",
                        lang: "sh",
                        isActive: true
                    },
                    {
                        reg: /^(sh|zsh|bash)$/i,
                        label: "Bash",
                        type: "CLI",
                        lang: "zsh",
                        isActive: true
                    },
                    {
                        reg: /^(sh|zsh|bash)$/i,
                        label: "Bash",
                        type: "CLI",
                        lang: "bash",
                        isActive: true
                    }
                ],
                isActive: true
            },
            {
                reg: /^(bat|cmd)$/i,
                label: "Cmd",
                type: "CLI",
                langs: [
                    "bat",
                    "cmd"
                ],
                langMap: {
                    bat: {
                        reg: /^(bat|cmd)$/i,
                        label: "Cmd",
                        type: "CLI",
                        lang: "bat",
                        isActive: false
                    },
                    cmd: {
                        reg: /^(bat|cmd)$/i,
                        label: "Cmd",
                        type: "CLI",
                        lang: "cmd",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^(bat|cmd)$/i,
                        label: "Cmd",
                        type: "CLI",
                        lang: "bat",
                        isActive: false
                    },
                    {
                        reg: /^(bat|cmd)$/i,
                        label: "Cmd",
                        type: "CLI",
                        lang: "cmd",
                        isActive: false
                    }
                ],
                isActive: false
            },
            {
                reg: /^ps1$/i,
                label: "PowerShell",
                type: "CLI",
                langs: [
                    "ps1"
                ],
                langMap: {
                    ps1: {
                        reg: /^ps1$/i,
                        label: "PowerShell",
                        type: "CLI",
                        lang: "ps1",
                        isActive: false
                    }
                },
                langArr: [
                    {
                        reg: /^ps1$/i,
                        label: "PowerShell",
                        type: "CLI",
                        lang: "ps1",
                        isActive: false
                    }
                ],
                isActive: false
            }
        ]
    }
} as const);

const allLangs = ([
  "js",
  "jsx",
  "mjs",
  "cjs",
  "ts",
  "tsx",
  "mts",
  "cts",
  "css",
  "less",
  "scss",
  "sass",
  "styl",
  "html",
  "htm",
  "pug",
  "ejs",
  "sh",
  "zsh",
  "bash",
  "bat",
  "cmd",
  "ps1"
] as const);

const allLabels = ([
  "Javascript",
  "Typescript",
  "CSS",
  "Less",
  "Sass",
  "Stylus",
  "HTML",
  "Pug",
  "EJS",
  "Bash",
  "Cmd",
  "PowerShell"
] as const);

const allType = ([
  "Program",
  "Style",
  "Template",
  "CLI"
] as const);

export type Lang = keyof typeof programLangs;

export const allLabelsLang = {
	Javascript: programLabels['Javascript'].langArr.find(l => l.isActive)?.lang!,
	Typescript: programLabels['Typescript'].langArr.find(l => l.isActive)?.lang!,
	CSS: programLabels['CSS'].langArr.find(l => l.isActive)?.lang!,
	Less: programLabels['Less'].langArr.find(l => l.isActive)?.lang!,
	Sass: programLabels['Sass'].langArr.find(l => l.isActive)?.lang!,
	Stylus: programLabels['Stylus'].langArr.find(l => l.isActive)?.lang!,
	HTML: programLabels['HTML'].langArr.find(l => l.isActive)?.lang!,
	Pug: programLabels['Pug'].langArr.find(l => l.isActive)?.lang!,
	EJS: programLabels['EJS'].langArr.find(l => l.isActive)?.lang!,
	Bash: programLabels['Bash'].langArr.find(l => l.isActive)?.lang!,
	Cmd: programLabels['Cmd'].langArr.find(l => l.isActive)?.lang!,
	PowerShell: programLabels['PowerShell'].langArr.find(l => l.isActive)?.lang!
};

export type AllLabelsLang = typeof allLabelsLang;

export const allActiveLabels = {
	Program: { activeLabel: programTypes['Program'].labelArr.find(l => l.isActive)?.langArr.find(l => l.isActive) },
	Style: { activeLabel: programTypes['Style'].labelArr.find(l => l.isActive)?.langArr.find(l => l.isActive) },
	Template: { activeLabel: programTypes['Template'].labelArr.find(l => l.isActive)?.langArr.find(l => l.isActive) },
	CLI: { activeLabel: programTypes['CLI'].labelArr.find(l => l.isActive)?.langArr.find(l => l.isActive) }
};

export type AllActiveLabels = typeof allActiveLabels;

export const allTypesLabel = {
	Program: { activeLabel: programTypes['Program'].labelArr.find(l => l.isActive)?.label! },
	Style: { activeLabel: programTypes['Style'].labelArr.find(l => l.isActive)?.label! },
	Template: { activeLabel: programTypes['Template'].labelArr.find(l => l.isActive)?.label! },
	CLI: { activeLabel: programTypes['CLI'].labelArr.find(l => l.isActive)?.label! }
};

export type AllTypesLabel = typeof allTypesLabel;

const getLangConf = (l:Lang) => (programLangs[l])
export type LangConf = Readonly<ReturnType<typeof getLangConf>>

export type Label = keyof typeof programLabels;

export type Type = keyof typeof programTypes;

export { programLangs, programLabels, programTypes, allLangs, allLabels, allType }
