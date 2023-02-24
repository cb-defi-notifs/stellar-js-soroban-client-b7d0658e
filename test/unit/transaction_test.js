const xdr = SorobanClient.xdr;

describe("assembleTransaction", () => {
  describe("FeeBumpTransaction", () => {
    // TODO: Add support for fee bump transactions
  });

  describe("Transaction", () => {
    const networkPassphrase = SorobanClient.Networks.TESTNET;
    const source = new SorobanClient.Account(
      "GBZXN7PIRZGNMHGA7MUUUF4GWPY5AYPV6LY4UV2GL6VJGIQRXFDNMADI",
      "1",
    );
    const emptyFootprint = new xdr.LedgerFootprint({
      readOnly: [],
      readWrite: [],
    });
    function emptyTransaction() {
      return new SorobanClient.TransactionBuilder(source, {
        fee: 100,
        networkPassphrase,
        v1: true,
      })
        .addOperation(
          SorobanClient.Operation.invokeHostFunction({
            function: xdr.HostFunction.hostFunctionTypeInvokeContract([]),
            parameters: [],
            footprint: emptyFootprint,
            auth: [],
          }),
        )
        .setTimeout(SorobanClient.TimeoutInfinite)
        .build();
    }

    it("adds the footprint to the transaction", () => {
      const txn = emptyTransaction();

      const result = SorobanClient.assembleTransaction(txn, networkPassphrase, [
        {
          auth: [],
          footprint: new xdr.LedgerFootprint({
            readOnly: [
              xdr.LedgerKey.contractCode(
                new xdr.LedgerKeyContractCode({
                  hash: Buffer.alloc(32),
                }),
              ),
            ],
            readWrite: [],
          }),
        },
      ]);

      expect(result.operations[0].footprint.readOnly.length).to.equal(1);
    });

    it("adds the auth to the transaction", () => {
      const txn = emptyTransaction();

      const result = SorobanClient.assembleTransaction(txn, networkPassphrase, [
        {
          auth: [
            new xdr.ContractAuth({
              addressWithNonce: null,
              rootInvocation: new xdr.AuthorizedInvocation({
                contractId: Buffer.alloc(32),
                functionName: "foo",
                args: [],
                subInvocations: [],
              }),
              signatureArgs: [],
            }),
          ],
          footprint: emptyFootprint,
        },
      ]);

      expect(result.operations[0].auth.length).to.equal(1);
    });
  });
});