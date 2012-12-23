Ext.define('Gajumaru.view.Header', {
    alias: 'widget.gajumaru-header',
    extend: 'Ext.container.Container',
    defaults: {
        xtype: 'container'
    },
    layout: 'hbox',
    items: [{
        html: {
            tag: 'h1',
            html: 'Gajumaru Portal'
        },
        flex: 1
    }, {
        xtype: 'toolbar',
        width: 217,
        items: [{
            text: 'ボタン1',
            iconCls: 'x-icon-1',
            action: 'button1'
        }, {
            text: 'ボタン2',
            iconCls: 'x-icon-2',
            action: 'button2'
        }, {
            text: 'ボタン3',
            iconCls: 'x-icon-3',
            action: 'button3'
        }]
    }]
});
