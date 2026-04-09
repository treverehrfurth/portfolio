---
title: "Snowflake Security Changes: New MFA Requirements and Best Practices"
summary: "Snowflake is eliminating password-only authentication by November 2025. Here's what's changing, who's affected, and how to prepare with authentication policies and KeyPair setup."
date: "Apr 9, 2025"
draft: false
tags:
  - Snowflake
  - Security
  - MFA
  - Identity & Access Management
---

![Snowflake MFA Requirements](./img1-hero.jpg)

Snowflake has steadily increased its security stance throughout 2024 and into 2025 with new tools like the Trust Center to evaluate and monitor security risks and by taking aggressive action on eliminating single-factor authentication using usernames and passwords alone. This is part of a broader effort to align with best cybersecurity practices and prevent credential theft and phishing attacks that remain among the most common security threats.

**By November 2025, no users (either human or service accounts) will be able to log in using just a password.**

Since October 2024, Snowflake has begun enforcing MFA (multi-factor authentication) by default on newly created accounts, and security will be further tightened by removing password-only authentication entirely by November 2025.

---

## Who Is Affected?

**Human Users (TYPE=PERSON or NULL):**

Any human user logging into Snowflake with only a password will be subject to mandatory MFA by April 2025. SAML/OAuth-based authentication will not require MFA.

After April, if users have not enrolled in MFA, their next login attempt will prompt them to enable it. By August 2025, password-only logins will be impossible regardless of custom authentication policies. Finally, by November 2025, password-only authentication will be fully abolished.

**Service Users (TYPE=SERVICE/LEGACY_SERVICE):**

Service users created for ETL tasks or system integrations using `TYPE=SERVICE` already operate without passwords. Until November 2025, `LEGACY_SERVICE` users can still rely on passwords. After the November 2025 deadline, all `LEGACY_SERVICE` users will be forcibly converted to `SERVICE` users, making password-based logins unavailable.

## Key Milestones

**April 2025**

All human users on accounts without a customized authentication policy will be required to enroll in MFA the next time they sign in using a password. `LEGACY_SERVICE` users will be blocked from accessing Snowsight.

**August 2025**

MFA will be required for all password-based sign-ins for human users, regardless of any custom authentication policy.

**November 2025**

Password-only authentication is fully blocked. `LEGACY_SERVICE` users are forcibly converted to `SERVICE` users, making password-based access impossible.

If users and systems have not migrated to MFA, SAML/OAuth, or KeyPair authentication, they will lose access to Snowflake.

## Action Plan

### Setup SSO/SCIM

If you haven't, this is a perfect opportunity to move to single sign-on and SCIM. This will satisfy Snowflake's MFA requirements, simplify the login flow, reduce your attack surface, and automate the provisioning and de-provisioning of users.

### Create Authentication Policies

Authentication policies give admins fine-tuned control over how each user authenticates, further securing your Snowflake instance. For most use cases, I recommend three separate authentication policies to handle SSO users, admins, and external users.

### Apply Authentication Policies

Authentication policies can be applied at the account level (aka default) and user level. When using SSO/SCIM, it's advised to set your SSO authentication policy at the account level so newly provisioned users through your IdP are automatically handled. You may then use the `ALTER USER` command to apply your other authentication policies respectively.

```sql
ALTER ACCOUNT SET AUTHENTICATION POLICY <policy_name>;
ALTER USER <user> SET AUTHENTICATION POLICY <policy_name>;
```

### Set User Types (TYPE)

Clearly separate human users (`TYPE=PERSON` or `NULL`) from system accounts (`TYPE=SERVICE` or `LEGACY_SERVICE`). Any non-human (service or integration) users should be reclassified as `SERVICE` which will remove and disallow passwords.

```sql
ALTER USER <user> SET TYPE = SERVICE;
```

### Transition Service Users to KeyPair or OAuth

`SERVICE` users cannot log in with passwords. They must use KeyPair or OAuth 2.0 tokens. For external API integration and batch processes, KeyPair authentication is typically recommended.

## Identify Affected Users

The easiest way to see which users in your Snowflake account will be affected by these changes is with a simple SQL query run as `ACCOUNTADMIN`. This query will show all active human users with passwords that are not enrolled in MFA.

```sql
SELECT name, type, disabled, has_mfa, has_password
FROM snowflake.account_usage.users
WHERE deleted_on IS NULL
  AND has_mfa = false
  AND has_password
  AND (type IS NULL OR type IN ('PERSON', 'LEGACY_SERVICE'))
  AND disabled = 'false'
ORDER BY NAME ASC;
```

## Recommended Authentication Policies

Authentication policies at creation are stored in a database and schema. I recommend creating a `SECURITY` database and a `POLICIES` schema at the `ACCOUNTADMIN` level to both store and reference policies.

### SSO Auth Policy

This policy limits SSO users to authenticate through SAML/KeyPair and disallows username/password auth. We have also removed the required `MFA_ENROLLMENT` option because ideally, you should be handling MFA through your IdP with SSO.

```sql
CREATE OR REPLACE AUTHENTICATION POLICY sso_auth_policy
  AUTHENTICATION_METHODS = ('SAML', 'KEYPAIR')
  CLIENT_TYPES = ('SNOWFLAKE_UI', 'SNOWSQL', 'DRIVERS')
  MFA_AUTHENTICATION_METHODS = ('SAML');
  --MFA_ENROLLMENT = REQUIRED; -- Disable if using SSO/SCIM with MFA
```

### Admin Auth Policy

While similar to the SSO auth policy above, it's imperative to allow select administrators to have username/password access as a **backdoor** in case the SSO integration breaks. If that integration breaks for any reason and you've disallowed all username/password access, you will be locked out and forced to open a ticket with Snowflake to restore your access.

Since password authentication is allowed with this policy, it's required that its users are enrolled in Snowflake's MFA.

```sql
CREATE OR REPLACE AUTHENTICATION POLICY admin_auth_policy
  AUTHENTICATION_METHODS = ('SAML', 'PASSWORD', 'KEYPAIR')
  CLIENT_TYPES = ('SNOWFLAKE_UI', 'SNOWSQL', 'DRIVERS')
  MFA_AUTHENTICATION_METHODS = ('PASSWORD', 'SAML')
  MFA_ENROLLMENT = REQUIRED;
```

### External Auth Policy

For users outside of your organization that won't be provisioned through SCIM, this policy will require MFA enrollment.

```sql
CREATE OR REPLACE AUTHENTICATION POLICY external_auth_policy
  AUTHENTICATION_METHODS = ('PASSWORD','KEYPAIR')
  CLIENT_TYPES = ('SNOWFLAKE_UI', 'SNOWSQL', 'DRIVERS')
  MFA_AUTHENTICATION_METHODS = ('PASSWORD')
  MFA_ENROLLMENT = REQUIRED;
```

### See Which Policy is Applied to Who

If you are trying to figure out which authentication policy is applied to which users, you can use this query to return that list. Replace `<database>` and `<policy_name>` respectively.

```sql
SELECT *
FROM TABLE(
    <database>.INFORMATION_SCHEMA.POLICY_REFERENCES(
      POLICY_NAME => '<database>.POLICIES.<policy_name>'
  )
);
```

## Setup KeyPair for Service Users

Refer to Snowflake's KeyPair documentation for up-to-date information, advanced use cases, and more in-depth explanations.

KeyPairs can be created with or without a passphrase. Some integrations may not allow or have the ability to enter a passphrase so create yours accordingly. KeyPairs work by having a private key and a public key that are mathematically linked to ensure secure communication, authentication, or data exchanges.

> You must store your keys and passphrases safely and securely.

**Generate Unencrypted Private Key**

```bash
openssl genrsa 2048 | openssl pkcs8 -topk8 -inform PEM -out rsa_key.p8 -nocrypt
```

**Generate Encrypted (with Passphrase) Private Key**

```bash
openssl genrsa 2048 | openssl pkcs8 -topk8 -v2 des3 -inform PEM -out rsa_key.p8
```

**Generate Public Key**

```bash
openssl rsa -in rsa_key.p8 -pubout -out rsa_key.pub
```

**Assign Public Key to Snowflake User**

Only owners of a user, or users with `SECURITYADMIN` role or higher can alter a user's `RSA_PUBLIC_KEY`.

```sql
ALTER USER example_user SET RSA_PUBLIC_KEY='MIIBIjANBgkqh...';
```

**Verify User's Public Key Fingerprint**

Run this as one block in Snowflake and record the output to compare.

```sql
DESC USER example_user;
SELECT SUBSTR((SELECT "value" FROM TABLE(RESULT_SCAN(LAST_QUERY_ID()))
  WHERE "property" = 'RSA_PUBLIC_KEY_FP'), LEN('SHA256:') + 1);
```

From terminal, run the following. If the outputs match, you've successfully configured your public key.

```bash
openssl rsa -pubin -in rsa_key.pub -outform DER | openssl dgst -sha256 -binary | openssl enc -base64
```

**Attach Private Key (and Passphrase)**

Take your private key and attach it to your integration(s) with your passphrase if you used an encrypted key, then validate that the connection is successful.

## Dealing with Issues

Once MFA is enabled, it's usually only a matter of time before one of your users will lose access to their MFA device and be unable to authenticate. Administrators can use `MINS_TO_BYPASS_MFA` or `DISABLE_MFA` options to temporarily restore user access, then re-enable MFA enrollment once that user is back in.

```sql
ALTER USER <user> SET MINS_TO_BYPASS_MFA = 5;
ALTER USER <user> SET DISABLE_MFA = TRUE;
```
