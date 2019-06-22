///Various configuration options
module sibr.config;

enum maxNicknameLength = 16;

enum defaultNickname = "Player";

///How often (in milliseconds) queued messages are sent
enum messageSendInterval = 100;

///Time between master loop ticks
enum masterLoopInterval = 5;
