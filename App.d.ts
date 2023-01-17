
interface PushPayload {
  categoryId: string;
  title: string;
  body?: string;
  data?: unknown;
}

interface Push {
  id: number;
  pushIdent: string;
  createdAt: string;
  pushPayload?: PushPayload;
}

interface PushResponse {
  actionIdentifier: string;
  categoryIdentifier: string;
  pushId: string;
  pushIdent: string;
  responseText?: string;
}

interface PushResponses {
  firstValidResponse: PushResponse;
  serviceResponses: PushResponse[];
  [key: string]: undefined; // any other
}
