A short guide for workflow-definitions examples

The flows in the different use cases (presentation exchange) can be categorized into three types, which are:

1. _Presentation_ - It can be referred to as a presentation / exchange of credentials issued by an authority. For example, `PermanentResidentCard`.
* The interact type would be `Unmediated`.
* The `presentation-definition` in the `credentialQuery` should ask for `PermanentResidentCard` (refer to [presentation-workflow](./presentation-workflow.md) example).

2. _Self-sign_ - It can be referred to as a presentation / workflow of a self-signed credential. For example, `ConsentCredential`. The workflow type in this case would be `Unmediated`.
* The interact type would be `Unmediated`.
* The `presentation-definition` in the `credentialQuery` should ask for a self-signed `ConsentCredential` (refer to [self-sign-workflow](./self-signed-workflow.md) example).

3. _Issuance_ - It can be referred to as a presentation / workflow needed to issue another credential.
* The interact type would be of type `Mediated`.
* An Issuance always comes after a presentation.
* The presentation needed for issuance can be of type `DIDAuth` or `PresentationDefinition`.
* The `DIDAuth` type workflow is required to prove control over the `DID` to which the credential is being issued (refer to [issuance-workflow](./issuance-workflow.md) example).
* For the workflow of type `PresentationDefinition`, the `credentialQuery` should ask for a credential. In our case, it could be either a self-signed credential i.e., `ConsentCredential` or `PermanentResidentCard`. The issuer gets the `DID` of the subject from the Verifiable Presentation containing the credential (refer to [presentation-issuance-workflow](./presentation-issuance-workflow.md) example).

Refer to the below specifications for a better understanding:

* [Presentation Definition](https://identity.foundation/presentation-exchange/#presentation-definition)
* [Submission Requirements](https://identity.foundation/presentation-exchange/#submission-requirement-feature)