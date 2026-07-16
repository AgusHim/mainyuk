export type PublicParticipant = {
  id: string;
  publicId: string;
  ticketName: string;
  userFullName: string;
  userGender: string;
  orderPublicId: string;
  voucherName: string;
  createdAt: string;
};

type DownloadParticipant = {
  id?: string | null;
  publicId?: string | null;
  createdAt?: string | null;
  userFullName?: string | null;
  userGender?: string | null;
  ticket?: {
    name?: string | null;
  } | null;
  user?: {
    userProfile?: {
      fullName?: string | null;
      gender?: string | null;
    } | null;
  } | null;
  order?: {
    publicId?: string | null;
    voucherCode?: {
      name?: string | null;
    } | null;
  } | null;
};

type ParticipantsResponse = {
  data?: {
    circleAdminDownloadEventUsers?: DownloadParticipant[];
  };
  errors?: Array<{ message?: string }>;
};

const DASHBOARD_GRAPHQL_URL =
  process.env.DASHBOARD_DARISINI_GRAPHQL_URL ||
  "https://dashboard.darisini.com/api/graphql";

const DASHBOARD_EVENT_ID =
  process.env.DASHBOARD_DARISINI_EVENT_ID || "cmrlrzyya0dzcs6019lsr8r81";

const PARTICIPANTS_QUERY = `
  query PublicEventParticipants(
    $_eventId: ID!
    $keyword: String
    $gender: String
    $startDate: DateTime
    $endDate: DateTime
  ) {
    circleAdminDownloadEventUsers(
      _eventId: $_eventId
      keyword: $keyword
      gender: $gender
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      publicId
      createdAt
      userFullName
      userGender
      ticket {
        name
      }
      user {
        userProfile {
          fullName
          gender
        }
      }
      order {
        publicId
        voucherCode {
          name
        }
      }
    }
  }
`;

const clean = (value: string | null | undefined) => value?.trim() || "-";

const normalizeGender = (value: string) => {
  const gender = value.toLowerCase();

  if (gender === "male") return "Ikhwan";
  if (gender === "female") return "Akhwat";

  return value;
};

const normalizeParticipant = (
  participant: DownloadParticipant,
): PublicParticipant => {
  const profile = participant.user?.userProfile;

  return {
    id: clean(participant.id),
    publicId: clean(participant.publicId),
    ticketName: clean(participant.ticket?.name),
    userFullName: clean(participant.userFullName || profile?.fullName),
    userGender: normalizeGender(clean(participant.userGender || profile?.gender)),
    orderPublicId: clean(participant.order?.publicId),
    voucherName: clean(participant.order?.voucherCode?.name),
    createdAt: clean(participant.createdAt),
  };
};

export async function getPublicParticipants(): Promise<PublicParticipant[]> {
  const cookie = process.env.DASHBOARD_DARISINI_COOKIE;

  if (!cookie) {
    throw new Error("DASHBOARD_DARISINI_COOKIE is not configured.");
  }

  const response = await fetch(DASHBOARD_GRAPHQL_URL, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Accept:
        "application/graphql-response+json; charset=utf-8, application/json; charset=utf-8",
      Cookie: cookie,
    },
    body: JSON.stringify({
      query: PARTICIPANTS_QUERY,
      variables: {
        _eventId: DASHBOARD_EVENT_ID,
        keyword: null,
        gender: null,
        startDate: null,
        endDate: null,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch participants: ${response.status}`);
  }

  const payload = (await response.json()) as ParticipantsResponse;

  if (payload.errors?.length) {
    throw new Error(
      payload.errors.map((error) => error.message).filter(Boolean).join(", "),
    );
  }

  return (payload.data?.circleAdminDownloadEventUsers || []).map(
    normalizeParticipant,
  );
}
