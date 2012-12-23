Ext.define('Gajumaru.view.Viewport', {
    uses: [
        'Gajumaru.view.Header',
        'Gajumaru.view.TodoList',
        'Gajumaru.view.Center'
    ],
    layout: {
        type: 'border',
        padding: 5
    },
    extend: 'Ext.container.Viewport',
    items: [{
        xtype: 'gajumaru-header',
        height: 35,
        region: 'north'
    }, {
        xtype: 'panel',
        region: 'west',
        split: true,
        width: 240,
        layout: 'border',
        items: [{
            xtype: 'panel',
            title: 'north',
            region: 'north'
        }, {
            xtype: 'gajumaru-todolist',
            region: 'center'
        }]
    }, {
        xtype: 'gajumaru-center',
        region: 'center'
    }]
});
