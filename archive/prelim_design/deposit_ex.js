/* This consists of responses from OpenAI Codex CLI */

  const BankAccountDeclIR = {
    kind: "objectDecl",
    name: "BankAccount",

    // Central state type for the object loop
    stateType: {
      kind: "structType",
      fields: {
        balance: "Int"
      }
    },

    // Message protocol (verb + payload type)
    protocol: [
      {
        verb: "deposit",
        payloadType: {
          kind: "structType",
          fields: { amount: "Int" }
        },
        replyType: {
          kind: "structType",
          fields: { ok: "Bool", balance: "Int" }
        }
      },
      {
        verb: "getBalance",
        payloadType: { kind: "structType", fields: {} },
        replyType: "Int"
      }
    ],

    // Initial state builder
    init: {
      inputs: [{ id: "openingBalance", type: "Int" }],
      body: {
        op: "struct",
        fields: { balance: "openingBalance" }
      },
      outputType: "BankAccount.state"
    },

    // Methods are pure state transitions
    methods: {
      deposit: "BankAccount.deposit",       // refers to method IR like earlier
      getBalance: "BankAccount.getBalance"
    }
  };


  const depositMethodIR = {
    kind: "method",
    name: "BankAccount.deposit",
    inputs: [
      { id: "in_state", type: "AccountState" },      // { balance: Int }
      { id: "in_msg", type: "DepositMsg" }           // { amount: Int }
    ],
    outputs: [
      { id: "out_nextState", type: "AccountState" },
      { id: "out_reply", type: "DepositReply" }      // { ok: Bool, balance:
  Int }
    ],
    nodes: [
      { id: "n_amount", op: "getField", args: ["in_msg", "amount"] },
      { id: "n_balance", op: "getField", args: ["in_state", "balance"] },

      { id: "n_zero", op: "const", value: 0 },
      { id: "n_nonneg", op: "ge", args: ["n_amount", "n_zero"] },
      { id: "n_check", op: "assert", args: ["n_nonneg"], error: "negative
  deposit" },

      { id: "n_newBalance", op: "add", args: ["n_balance", "n_amount"] },

      { id: "n_nextState", op: "struct", fields: { balance: "n_newBalance" } },
      { id: "n_reply", op: "struct", fields: { ok: true, balance:
  "n_newBalance" } }
    ],
    wiring: [
      { from: "n_check", to: "n_newBalance" }, // dependency edge
      { from: "n_nextState", to: "out_nextState" },
      { from: "n_reply", to: "out_reply" }
    ]
  };

