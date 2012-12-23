Ext.define('Gajumaru.controller.Header', {

    extend: 'Ext.app.Controller',

    init: function() {

        var me = this;

        me.control({
            'gajumaru-header button[action=button1]': {
                click: function() {
                    Ext.Msg.alert('ボタン1', 'クリックされました。');
                }
            },
            'gajumaru-header button[action=button2]': {
                click: function() {
                    Ext.Msg.alert('ボタン2', 'クリックされました。');
                }
            },
            'gajumaru-header button[action=button3]': {
                click: function() {
                    Ext.Msg.alert('ボタン3', 'クリックされました。');
                }
            }
        });

    }

});
