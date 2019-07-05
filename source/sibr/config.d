///Various configuration options
module sibr.config;

enum maxNicknameLength = 16;

enum defaultNickname = "Player";

///How often (in milliseconds) queued messages are sent
enum messageSendInterval = 20;

///How often update messages are sent
enum clientUpdateInterval = 100;

///Time between master loop ticks
enum masterLoopInterval = 5;

///maximum dt to trust from clients
enum ubyte maxInputDT = 40;

///The movement values of inputs are multiplied by this to determine the velocity
enum float inputVelocityMultiplier = 0.002;
