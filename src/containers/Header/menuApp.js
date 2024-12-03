export const adminMenu = [
    { //quản lý người dùng
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.admin.manage-user', link: '/system/user-manage'
            },
            {
                name: 'menu.admin.manage-doctor', link: '/system/manage-doctor'
            },
            {
                name: 'menu.admin.manage-admin', link: '/system/user-admin'
            },
            {
                name: 'menu.admin.crud-redux', link: '/system/user-redux'
            },
            { //quản lý người dùng
                name: 'menu.doctor.manage-schedule', link: '/doctor/schedule-manage'
            },
        ]
    },
    { //quản lý phòng khám
        name: 'menu.admin.manage-clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic', link: '/system/manage-clinic'
            },

        ]
    },
    { //quản lý chuyên khoa
        name: 'menu.admin.manage-specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty', link: '/system/manage-specialty'
            },

        ]
    },
    { //quản lý cẩm nang
        name: 'menu.admin.manage-handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook', link: '/system/hanbook-manage'
            },

        ]
    },
];

export const doctorMenu = [
    { //quản lý người dùng
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.doctor.manage-schedule', link: '/doctor/schedule-manage'
            },
        ]

    },
];