import { AnalyticsClient } from "../resources/analytics";
import { AuditClient } from "../resources/audit";
import { ChangeRequestsClient } from "../resources/change-requests";
import { ClientsClient } from "../resources/clients";
import { CodeReferencesClient } from "../resources/code-references";
import { EnvironmentsClient } from "../resources/environments";
import { EventsClient } from "../resources/events";
import { FlagsClient } from "../resources/flags";
import { IdentitiesClient } from "../resources/identities";
import { ImportExportClient } from "../resources/import-export";
import { RuntimeClient } from "../resources/runtime";
import { SegmentsClient } from "../resources/segments";
import type { FlagifyTransport } from "./transport";

export class ProjectClient {
  readonly environments: EnvironmentsClient;
  readonly segments: SegmentsClient;
  readonly flags: FlagsClient;
  readonly clients: ClientsClient;
  readonly identities: IdentitiesClient;
  readonly audit: AuditClient;
  readonly analytics: AnalyticsClient;
  readonly changeRequests: ChangeRequestsClient;
  readonly codeReferences: CodeReferencesClient;
  readonly importExport: ImportExportClient;
  readonly events: EventsClient;
  readonly runtime: RuntimeClient;

  public constructor(
    transport: FlagifyTransport,
    private readonly projectId: string,
  ) {
    this.environments = new EnvironmentsClient(transport, projectId);
    this.segments = new SegmentsClient(transport, projectId);
    this.flags = new FlagsClient(transport, projectId);
    this.clients = new ClientsClient(transport, projectId);
    this.identities = new IdentitiesClient(transport, projectId);
    this.audit = new AuditClient(transport, projectId);
    this.analytics = new AnalyticsClient(transport, projectId);
    this.changeRequests = new ChangeRequestsClient(transport, projectId);
    this.codeReferences = new CodeReferencesClient(transport, projectId);
    this.importExport = new ImportExportClient(transport, projectId);
    this.events = new EventsClient(transport, projectId);
    this.runtime = new RuntimeClient(transport, projectId);
  }

  public id() {
    return this.projectId;
  }
}
