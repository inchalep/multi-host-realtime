const {
  CreateParticipantTokenCommand,
  CreateStageCommand,
  IVSRealTimeClient,
} = require("@aws-sdk/client-ivs-realtime");

const config = {
  credentials: {
    accessKeyId: "AKIA3IGFLMT2ILYHTBBZ",
    secretAccessKey: "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",
  },
};
const stages = {};
const stageParticipants = {};

const ivsRealtimeClient = new IVSRealTimeClient(config);

const getStage = (name) => {
  return stages[name];
};

const stageExists = (name) => {
  return stages.hasOwnProperty(name);
};

const createStage = async (name) => {
  const createStageRequest = new CreateStageCommand({ name });
  const createStageResponse = await ivsRealtimeClient.send(createStageRequest);
  stages[name] = createStageResponse.stage;
  stageParticipants[name] = [];
  return stages[name];
};

const createStageParticipantToken = async (
  stageName,
  userId,
  username,
  duration = 60
) => {
  let stage;
  if (!stageExists(stageName)) {
    stage = await createStage(stageName);
  } else {
    stage = getStage(stageName);
  }
  const stageArn = stage.arn;

  const createStageTokenRequest = new CreateParticipantTokenCommand({
    attributes: {
      username,
    },
    userId,
    stageArn,
    duration,
  });
  const createStageTokenResponse = await ivsRealtimeClient.send(
    createStageTokenRequest
  );
  const participantToken = createStageTokenResponse.participantToken;
  stageParticipants[stageName].push(participantToken);
  return participantToken;
};

module.exports = {
  getStage,
  stageExists,
  createStage,
  createStageParticipantToken,
};
