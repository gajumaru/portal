// Ext.Loader有効化
Ext.Loader.setConfig({
    enabled: true
});

// アプリケーション設定
Ext.application({

    // Viewport自動生成
    autoCreateViewport: true,

    // アプリケーション名
    name: 'Gajumaru',

    // アプリケーションフォルダパス
    appFolder: 'src/app',

    // 使用コントローラー定義
    controllers: ['Main', 'Header', 'Center', 'TodoList'],

    // アプリケーション起動時イベントハンドラ
    launch: function() {

    }

});
