export function generateMassiveMockMarkdown(): string {
  const topics = [
    { title: "System Systematics & Distributed Consensus", codeLang: "rust", code: "fn propose_value<T>(val: T) -> ConsensusResult<T> {\n    let quorum = get_active_nodes().len() / 2 + 1;\n    // Raft heartbeat verification loop\n}" },
    { title: "High-Performance Compute & Micro-Optimizations", codeLang: "cpp", code: "#pragma omp parallel for\nfor(size_t i=0; i < massive_vector.size(); i++) {\n    compute_simd_matrix(massive_vector[i]);\n}" },
    { title: "Database Sharding Strategies & Replication Lag", codeLang: "sql", code: "CREATE TABLE shard_key_master (\n    id BIGINT GENERATED ALWAYS AS IDENTITY,\n    region_code VARCHAR(10) NOT NULL,\n    payload JSONB,\n    PRIMARY KEY (region_code, id)\n) PARTITION BY LIST (region_code);" },
    { title: "Container Orchestration & Service Meshes", codeLang: "yaml", code: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: hyper-scaler-pod\nspec:\n  replicas: 1500\n  template:\n    spec:\n      containers:\n        - name: core-proxy\n          image: envoyproxy/envoy:v1.28.0" },
    { title: "Modern Web Hydration Architectures", codeLang: "typescript", code: "export async function serverRenderPartial<T>(component: React.FC<T>) {\n    const stream = await renderToPipeableStream(component);\n    return stream.pipe(res);\n}" },
    { title: "Real-Time Telemetry & Distributed Tracing", codeLang: "go", code: "func StartSpan(ctx context.Context, name string) trace.Span {\n    tracer := otel.Tracer(\"core-engine\")\n    _, span := tracer.Start(ctx, name)\n    return span\n}" },
    { title: "Machine Learning Training Pipelines & LLM Serving", codeLang: "python", code: "import torch\nimport transformers\n\nmodel = transformers.AutoModelForCausalLM.from_pretrained('mistral-7b', device_map='auto')\noutputs = model.generate(**inputs, max_new_tokens=512)" },
    { title: "Zero-Trust Security & Mutual TLS Encryption", codeLang: "bash", code: "openssl req -x509 -newkey rsa:4096 -keyout ca.key -out ca.crt -days 3650 -nodes" },
    { title: "GraphQL Federation & Subgraph Gateways", codeLang: "graphql", code: "extend schema @link(url: \"https://specs.apollo.dev/federation/v2.5\", import: [\"@key\", \"@shareable\"])\n\ntype EnterpriseUser @key(fields: \"uuid\") {\n    uuid: ID!\n    permissions: [String!]! @shareable\n}" },
    { title: "Quantum Resilient Cryptography Algorithms", codeLang: "rust", code: "pub struct Kyber512Keypair {\n    public_key: [u8; 800],\n    secret_key: [u8; 1632],\n}" }
  ];

  const paragraphs = [
    "In modern hyper-scale infrastructures, fault tolerance is not merely an afterthought; it is the absolute foundation upon which all sub-services operate. When network partitions occur, the PACELC theorem mandates that a trade-off must be struck between latency and consistency even during standard non-partitioned operational phases.",
    "Furthermore, leveraging asynchronous IO combined with event loop architectures allows single processes to saturate 100% of multi-core machines without succumbing to context-switching overhead or memory bloat caused by thread-per-connection paradigms.",
    "Memory-mapped files (mmap) provide a highly efficient bridge between user space applications and the kernel page cache. By bypassing the traditional user-kernel copy boundaries, intensive database systems achieve near read-speed parity with raw random access memory operations.",
    "Security profiles must adopt a Defense-in-Depth posture. Implementing strict Security Enhanced Linux (SELinux) policies, coupled with eBPF (Extended Berkeley Packet Filter) socket filters, ensures that anomalous rogue binaries are isolated cleanly before executing unauthorized system calls.",
    "The emergence of Edge Computing shifts computational loads directly closer to the consuming clients. By routing static and dynamic dynamic request processing directly to POPs (Points of Presence) situated worldwide, Time to First Byte (TTFB) drops precipitously to sub-20 milliseconds."
  ];

  let lines: string[] = [];

  lines.push("# The Comprehensive Encyclopedia of System Architecture & Engineering");
  lines.push("> This authoritative reference guide has been synthesized to demonstrate the supreme rendering speed of our Markdown Website Engine. It contains over 35,000 functional lines of rich text, code specimens, structured matrices, and technical admonitions.");
  lines.push("");

  // Generate 40 major chapters to easily reach ~35,000 lines
  const targetLines = 34500;
  let chapterIndex = 1;

  while (lines.length < targetLines) {
    const topic = topics[(chapterIndex - 1) % topics.length];
    
    lines.push(`## Chapter ${chapterIndex}: ${topic.title}`);
    lines.push("");
    lines.push(`Welcome to **Chapter ${chapterIndex}**, a thorough masterclass investigating the core tenets of ${topic.title.toLowerCase()}. Throughout this exhaustive analysis, we shall review mathematical models, benchmarking profiles, and concrete implementation patterns.`);
    lines.push("");

    // Admonition callouts
    lines.push("> [!IMPORTANT]");
    lines.push("> System engineers operating in production must observe all compliance metrics detailed within this section. Failure to implement rate limiting may precipitate cascading outages during peak traffic events.");
    lines.push("");

    // Generate multiple deep sections within the chapter
    for (let s = 1; s <= 6; s++) {
      lines.push(`### ${chapterIndex}.${s} Theoretical Principles & Edge Cases`);
      lines.push("");
      lines.push(paragraphs[(chapterIndex + s) % paragraphs.length]);
      lines.push("");
      lines.push(paragraphs[(chapterIndex * s) % paragraphs.length]);
      lines.push("");

      // Insert a Code Block
      if (s === 2 || s === 4) {
        lines.push(`Below is an authenticated production-ready execution block authored in **${topic.codeLang.toUpperCase()}**:`);
        lines.push("");
        lines.push(`\`\`\`${topic.codeLang}`);
        lines.push(topic.code);
        lines.push("```");
        lines.push("");
      }

      // Insert a Data Table
      if (s === 3) {
        lines.push("#### Comparative Benchmark Protocol Matrix");
        lines.push("");
        lines.push("| Algorithm / Tool | Throughput (Req/sec) | P99 Latency (ms) | Resource Footprint | Failure Mode |");
        lines.push("| :--- | :---: | :---: | :---: | :--- |");
        lines.push("| **Epoll Event Loop** | 450,000 | 1.2ms | Ultra Low (12MB) | Graceful Degradation |");
        lines.push("| **Thread-per-Req** | 85,000 | 14.8ms | High (4.2GB) | Out of Memory (OOM) |");
        lines.push("| **Goroutine Pool** | 380,000 | 2.4ms | Medium (180MB) | Garbage Collector Stalls |");
        lines.push("| **Actor Framework** | 410,000 | 1.8ms | Moderate (250MB) | Mailbox Overflow |");
        lines.push("");
      }

      // Insert a Task List
      if (s === 5) {
        lines.push("#### Production Deployment Operational Verification List");
        lines.push("");
        lines.push("- [x] Verify mutual TLS certificate renewal daemons");
        lines.push("- [x] Execute randomized chaos engineering network partition trials");
        lines.push("- [ ] Audit IAM privilege escalation vectors across AWS accounts");
        lines.push("- [ ] Confirm database cold-storage snapshots encrypt with KMS keys");
        lines.push("");
      }

      // Insert detailed line padding to boost realistic reading material
      lines.push("The architectural consensus surrounding this deployment topology indicates strong resilience against Byzantine faults. By partitioning the state space into mutually exclusive logical shards, each respective database node maintains full ownership over its allocated range without demanding distributed locking over high-contention memory registers.");
      lines.push("");
      lines.push("Let us examine the exact mathematical formula dictating latency bounds under high concurrency:");
      lines.push("");
      lines.push("`L_total = L_network + (N_concurrent * T_service) / Max(1, N_workers)`");
      lines.push("");
      lines.push("When `N_concurrent` approaches infinity, the system experiences queueing delay proportional to the arrival rate lambda. Consequently, proactive shedding of low-priority analytical workloads becomes strictly paramount to preserve the responsiveness of highly sensitive transactional endpoints.");
      lines.push("");
    }

    chapterIndex++;
  }

  // Add final concluding remarks
  lines.push("## Appendix: Glossary & Complete Index");
  lines.push("");
  lines.push("This brings us to the conclusion of our monumental document. With exactly **" + lines.length + "** lines of markdown successfully converted into an interactive, lightning-fast web experience, you can confidently upload your own massive specifications, documentation repos, and literary works!");

  return lines.join("\n");
}
