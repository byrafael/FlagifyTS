import { describe, expect, test } from "bun:test";
import { FlagifyClient, FlagifyError } from "../src/index";

const liveBaseUrl = process.env.FLAGIFY_LIVE_BASE_URL;
const liveApiKey = process.env.FLAGIFY_LIVE_API_KEY;

const runLive = Boolean(liveBaseUrl) && Boolean(liveApiKey);

const getLiveConfig = () => {
  if (!liveBaseUrl || !liveApiKey) {
    throw new Error("Live Flagify test configuration is incomplete.");
  }

  return {
    baseUrl: liveBaseUrl,
    apiKey: liveApiKey,
  };
};

const unique = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

describe.if(runLive)("Flagify live integration", () => {
  test("exercises the live API across admin and runtime flows", async () => {
    const config = getLiveConfig();
    const rootClient = new FlagifyClient(config);

    let projectId = "";

    try {
      const project = await rootClient.projects.create({
        name: unique("SDK Project"),
        slug: unique("sdk-project"),
      });
      projectId = project.id;

      const projectClient = rootClient.project(projectId);
      const initialEnvironments = await projectClient.environments.list();
      const productionEnvironment = initialEnvironments.items.find(
        (item) => item.key === "production",
      );
      expect(productionEnvironment).toBeDefined();
      if (!productionEnvironment) {
        throw new Error(
          "Expected the live server to provision a production environment.",
        );
      }

      const qaEnvironment = await projectClient.environments.create({
        key: unique("qa"),
        name: "QA",
        description: "Quality assurance",
        sort_order: 20,
      });

      const listedEnvironments = await projectClient.environments.list();
      expect(listedEnvironments.items.length).toBeGreaterThanOrEqual(2);

      const fetchedQaEnvironment = await projectClient.environments.get(
        qaEnvironment.id,
      );
      expect(fetchedQaEnvironment.key).toBe(qaEnvironment.key);

      const updatedQaEnvironment = await projectClient.environments.update({
        environmentId: qaEnvironment.id,
        data: {
          name: "QA Updated",
          sort_order: 25,
        },
      });
      expect(updatedQaEnvironment.name).toBe("QA Updated");

      const primaryClient = await projectClient.clients.create({
        key: "web",
        name: "Web Client",
        metadata: {
          plan: "premium",
          country: "US",
        },
      });
      const disposableClient = await projectClient.clients.create({
        key: "disposable",
        name: "Disposable Client",
        metadata: {
          plan: "basic",
        },
      });

      const listedClients = await projectClient.clients.list({
        limit: 10,
        offset: 0,
      });
      expect(listedClients.items.length).toBeGreaterThanOrEqual(2);

      const fetchedClient = await projectClient.clients.get(primaryClient.id);
      expect(fetchedClient.key).toBe("web");

      const updatedClient = await projectClient.clients.update({
        clientId: disposableClient.id,
        data: {
          name: "Disposable Client Updated",
        },
      });
      expect(updatedClient.name).toBe("Disposable Client Updated");

      const projectReadKey = await rootClient.keys.create({
        kind: "project_read",
        projectId,
        name: "Project Read Key",
      });
      const runtimeKey = await rootClient.keys.create({
        kind: "client_runtime",
        projectId,
        clientId: primaryClient.id,
        name: "Runtime Key",
      });

      const listedKeys = await rootClient.keys.list({
        projectId,
        limit: 10,
        offset: 0,
      });
      expect(
        listedKeys.items.some((item) => item.id === projectReadKey.id),
      ).toBe(true);

      const fetchedKey = await rootClient.keys.get(projectReadKey.id);
      expect(fetchedKey.kind).toBe("project_read");

      const segment = await projectClient.segments.create({
        key: "premium_users",
        name: "Premium Users",
        rules: [
          {
            attribute: "metadata.plan",
            operator: "equals",
            value: "premium",
          },
        ],
      });

      const listedSegments = await projectClient.segments.list();
      expect(listedSegments.items.some((item) => item.id === segment.id)).toBe(
        true,
      );

      const fetchedSegment = await projectClient.segments.get(segment.id);
      expect(fetchedSegment.key).toBe("premium_users");

      const updatedSegment = await projectClient.segments.update({
        segmentId: segment.id,
        data: {
          description: "Updated segment",
        },
      });
      expect(updatedSegment.description).toBe("Updated segment");

      const flag = await projectClient.flags.create({
        key: "new_dashboard",
        name: "New Dashboard",
        description: "SDK live flow flag",
        flag_kind: "experiment",
        type: "select",
        default_value: "control",
        options: ["control", "variant_a"],
        variants: [
          {
            key: "control",
            name: "Control",
            value: "control",
          },
          {
            key: "variant_a",
            name: "Variant A",
            value: "variant_a",
          },
        ],
        default_variant_key: "control",
      });

      const disposableFlag = await projectClient.flags.create({
        key: "kill_switch",
        name: "Kill Switch",
        type: "boolean",
        default_value: false,
      });

      const listedFlags = await projectClient.flags.list({
        limit: 10,
        offset: 0,
      });
      expect(listedFlags.items.some((item) => item.id === flag.id)).toBe(true);

      const fetchedFlag = await projectClient.flags.get(flag.id);
      expect(fetchedFlag.key).toBe("new_dashboard");

      const updatedFlag = await projectClient.flags.update({
        flagId: flag.id,
        data: {
          name: "New Dashboard Updated",
        },
      });
      expect(updatedFlag.name).toBe("New Dashboard Updated");

      const upsertedEnvironmentConfig =
        await projectClient.flags.putEnvironmentConfig({
          flagId: flag.id,
          environmentKey: "production",
          data: {
            default_variant_key: "control",
            rules: [
              {
                name: "Everyone",
                conditions: [],
                segment_keys: [],
                percentage: 100,
                bucketing_key: "key",
                serve: {
                  variant_key: "variant_a",
                },
              },
            ],
          },
        });
      expect(upsertedEnvironmentConfig.rules.length).toBe(1);

      const fetchedEnvironmentConfig =
        await projectClient.flags.getEnvironmentConfig({
          flagId: flag.id,
          environmentKey: "production",
        });
      expect(fetchedEnvironmentConfig.rules.length).toBe(1);

      const readClient = new FlagifyClient({
        baseUrl: config.baseUrl,
        apiKey: projectReadKey.secret,
        projectId,
      });
      const runtimeClient = new FlagifyClient({
        baseUrl: config.baseUrl,
        apiKey: runtimeKey.secret,
      });

      const projectRuntimeConfig = await readClient.runtime.getClientConfig({
        clientKey: primaryClient.key,
        environment: "production",
      });
      expect(projectRuntimeConfig.project.id).toBe(projectId);
      expect(projectRuntimeConfig.flags.new_dashboard?.value).toBe("variant_a");

      const projectRuntimeFlag = await readClient.runtime.getClientFlag({
        clientKey: primaryClient.key,
        flagKey: flag.key,
        environment: "production",
      });
      expect(projectRuntimeFlag.value).toBe("variant_a");

      const boundRuntimeConfig = await runtimeClient.runtime.getBoundConfig({
        environment: "production",
      });
      expect(boundRuntimeConfig.project.id).toBe(projectId);

      const boundRuntimeFlag = await runtimeClient.runtime.getBoundFlag({
        flagKey: flag.key,
        environment: "production",
      });
      expect(boundRuntimeFlag.value).toBe("variant_a");

      const override = await projectClient.clients.putOverride({
        clientId: primaryClient.id,
        flagId: flag.id,
        value: "control",
      });
      expect(override.value).toBe("control");

      const listedOverrides = await projectClient.clients.listOverrides(
        primaryClient.id,
      );
      expect(listedOverrides.items.length).toBe(1);

      const overriddenRuntimeFlag = await runtimeClient.runtime.getBoundFlag({
        flagKey: flag.key,
        environment: "production",
      });
      expect(overriddenRuntimeFlag.value).toBe("control");

      await projectClient.clients.deleteOverride({
        clientId: primaryClient.id,
        flagId: flag.id,
      });

      const identity = await projectClient.identities.create({
        kind: "user",
        identifier: unique("user"),
        display_name: "Primary User",
        traits: {
          plan: "pro",
          country: "us",
        },
      });
      expect(identity.id).toBeTruthy();

      const listedIdentities = await projectClient.identities.list({
        limit: 10,
        offset: 0,
      });
      expect(
        listedIdentities.items.some((item) => item.id === identity.id),
      ).toBe(true);

      const fetchedIdentity = await projectClient.identities.get(identity.id);
      expect(fetchedIdentity.identifier).toBe(identity.identifier);

      const updatedIdentity = await projectClient.identities.update({
        identityId: identity.id,
        data: {
          display_name: "Updated User",
        },
      });
      expect(updatedIdentity.display_name).toBe("Updated User");

      const traitsBefore = await projectClient.identities.listTraits(
        identity.id,
      );
      expect(typeof traitsBefore.traits).toBe("object");

      const patchedTraits = await projectClient.identities.setTraits({
        identityId: identity.id,
        set: {
          plan: "enterprise",
          beta: true,
        },
        unset: ["country"],
      });
      expect(patchedTraits.traits.plan).toBe("enterprise");

      const putTrait = await projectClient.identities.putTrait({
        identityId: identity.id,
        traitKey: "region",
        value: "latam",
      });
      expect(putTrait.identity_id).toBe(identity.id);

      const evaluatedIdentity = await projectClient.runtime.evaluateIdentity({
        environmentKey: "production",
        data: {
          kind: identity.kind,
          identifier: identity.identifier,
          transient_traits: {
            plan: "enterprise",
          },
          flag_keys: [flag.key],
        },
      });
      expect(evaluatedIdentity.project.id).toBe(projectId);

      const identityConfig = await projectClient.runtime.getIdentityConfig({
        environmentKey: "production",
        kind: identity.kind,
        identifier: identity.identifier,
        data: {
          flag_keys: [flag.key],
          transient_traits: {
            plan: "enterprise",
          },
        },
      });
      expect(identityConfig.project.id).toBe(projectId);

      const identityFlag = await projectClient.runtime.getIdentityFlag({
        environmentKey: "production",
        kind: identity.kind,
        identifier: identity.identifier,
        flagKey: flag.key,
        data: {
          transient_traits: {
            plan: "enterprise",
          },
        },
      });
      expect(identityFlag.key).toBe(flag.key);

      const snapshot = await projectClient.runtime.getEnvironmentSnapshot({
        environmentKey: "production",
      });
      expect(snapshot.notModified).toBe(false);
      expect(snapshot.etag).toBeTruthy();

      const snapshotChecksum =
        typeof snapshot.data?.meta === "object" &&
        snapshot.data?.meta !== null &&
        "snapshot_checksum" in snapshot.data.meta
          ? String(snapshot.data.meta.snapshot_checksum)
          : null;

      const acceptedBatch = await projectClient.runtime.batchEvaluationEvents({
        data: {
          environment_key: "production",
          batch_id: unique("batch"),
          snapshot_checksum: snapshotChecksum,
          events: [
            {
              flag_key: flag.key,
              client_key: primaryClient.key,
              identity_kind: identity.kind,
              identity_identifier: identity.identifier,
              variant_key: "variant_a",
              value: "variant_a",
              reason: "batch_ingest",
              traits: {
                plan: "enterprise",
              },
              occurred_at: new Date().toISOString(),
            },
          ],
        },
      });
      expect(acceptedBatch.accepted).toBe(1);

      const events = await projectClient.events.list({
        limit: 20,
        offset: 0,
      });
      expect(events.items.length).toBeGreaterThan(0);

      const byFlag = await projectClient.analytics.byFlag({ limit: 20 });
      const byVariant = await projectClient.analytics.byVariant({ limit: 20 });
      const byEnvironment = await projectClient.analytics.byEnvironment({
        limit: 20,
      });
      const recentActivity = await projectClient.analytics.recentActivity({
        limit: 20,
      });
      expect(Array.isArray(byFlag.items)).toBe(true);
      expect(Array.isArray(byVariant.items)).toBe(true);
      expect(Array.isArray(byEnvironment.items)).toBe(true);
      expect(Array.isArray(recentActivity.items)).toBe(true);

      const codeReferences = await projectClient.codeReferences.create({
        references: [
          {
            flag_key: flag.key,
            source_type: "repo_scan",
            source_name: "flagifyts",
            reference_path: "src/live.test.ts",
            reference_line: 42,
            reference_context:
              'if (flags.new_dashboard?.value === "variant_a") {}',
            observed_at: new Date().toISOString(),
          },
        ],
      });
      expect(codeReferences.items.length).toBe(1);

      const listedCodeReferences = await projectClient.codeReferences.list({
        limit: 20,
        offset: 0,
      });
      expect(listedCodeReferences.items.length).toBeGreaterThan(0);

      try {
        const staleReport = await projectClient.flags.staleReport({
          limit: 20,
          offset: 0,
        });
        expect(Array.isArray(staleReport.items)).toBe(true);
      } catch (error) {
        expect(error).toBeInstanceOf(FlagifyError);
        const flagifyError = error as FlagifyError;
        expect(flagifyError.status).toBe(404);
        expect(flagifyError.code).toBe("not_found");
      }

      const auditLogs = await projectClient.audit.list({
        limit: 20,
        offset: 0,
      });
      expect(auditLogs.items.length).toBeGreaterThan(0);

      const exported = await projectClient.importExport.export();
      expect(exported.project?.id).toBe(projectId);

      const importDryRun = await projectClient.importExport.import({
        data: exported,
        dryRun: true,
        replace: false,
      });
      expect(typeof importDryRun).toBe("object");

      const protectedProductionEnvironment =
        await projectClient.environments.update({
          environmentId: productionEnvironment.id,
          data: {
            requires_change_requests: true,
          },
        });
      expect(protectedProductionEnvironment.requires_change_requests).toBe(1);

      const changeRequest = await projectClient.changeRequests.create({
        flag_id: flag.id,
        environment_key: "production",
        title: "Promote premium rollout",
        description: "Integration test change request",
        base_snapshot_checksum: snapshotChecksum,
        desired_config: {
          default_variant_key: "control",
          rules: [
            {
              name: "Premium segment rollout",
              conditions: [],
              segment_keys: [segment.key],
              percentage: 100,
              bucketing_key: "key",
              serve: {
                variant_key: "variant_a",
              },
            },
          ],
        },
      });
      expect(changeRequest.status).toBe("pending");

      const listedChangeRequests = await projectClient.changeRequests.list({
        limit: 20,
        offset: 0,
      });
      expect(
        listedChangeRequests.items.some((item) => item.id === changeRequest.id),
      ).toBe(true);

      const fetchedChangeRequest = await projectClient.changeRequests.get(
        changeRequest.id,
      );
      expect(fetchedChangeRequest.id).toBe(changeRequest.id);

      const reviewedChangeRequest = await projectClient.changeRequests.review({
        changeRequestId: changeRequest.id,
        decision: "approve",
      });
      expect(reviewedChangeRequest.status).toBe("approved");

      const appliedChangeRequest = await projectClient.changeRequests.apply(
        changeRequest.id,
      );
      expect(appliedChangeRequest.status).toBe("applied");

      const createdCodeReference = codeReferences.items[0];
      expect(createdCodeReference).toBeDefined();
      if (!createdCodeReference) {
        throw new Error("Expected a created code reference.");
      }
      await projectClient.codeReferences.delete(createdCodeReference.id);
      await projectClient.identities.delete(identity.id);
      await projectClient.clients.delete(disposableClient.id);
      try {
        await projectClient.flags.delete(disposableFlag.id);
      } catch (error) {
        expect(error).toBeInstanceOf(FlagifyError);
        const flagifyError = error as FlagifyError;
        expect(flagifyError.status).toBe(500);
        expect(flagifyError.code).toBe("internal_error");
      }
      await projectClient.segments.delete(segment.id);
      await projectClient.environments.delete(qaEnvironment.id);
      await rootClient.keys.revoke(projectReadKey.id);

      const remainingOverrides = await projectClient.clients.listOverrides(
        primaryClient.id,
      );
      expect(remainingOverrides.items.length).toBe(0);
    } finally {
      if (projectId) {
        await rootClient.projects.delete(projectId);
      }
    }
  }, 30000);

  test("parses nested live error envelopes", async () => {
    const config = getLiveConfig();
    const client = new FlagifyClient({
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
    });

    try {
      await client.runtime.getBoundConfig({ environment: "production" });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(FlagifyError);
      const flagifyError = error as FlagifyError;
      expect(flagifyError.status).toBe(403);
      expect(flagifyError.code).toBe("forbidden");
      expect(flagifyError.message).toContain("not bound to a runtime client");
    }
  });
});
