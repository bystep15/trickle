module.exports = {
    // lint your project's client code
    project: {
        src: [
            'src/project/**/*.js'
        ],
        directives: {
            browser: true,
            nomen: true,        // 允许下划线
            unparam: true,      // 允许未使用的参数
            predef: [
                'seajs',
                'define',
                'console',
                'alert',
                'location',
                'describe',
                'it',
                'expect'
            ]
        },
        exclude: [
        ],
        options: {
            edition: 'latest'
            //junit: 'out/client-junit.xml'
        }
    }
};
