# Brainstorming

## Runtime Organization

```
application
    component
        objects
            configuration
```

Components consist of one or more objects. These objects can be compute, storage, connections, etc. and will ultimately be saved in an `architecture.sct` file (`.sct` is the Scoot language file extension).

For now, we are saving the configuration inside of a JSON file (basically a dump of the configuration constructed using objects). This omits the need for a database to store the configuration and lets us track changes in source control.

## Runtime Workspace
The runtime does everything locally, using state files checked in to source control. 

Ephemeral runtime files are kept inside of the `.scoots` directory. This directory should not be included in source control. This directory contains things like the downloaded contents of repositories that need to be uploaded to the cloud provider, logs, etc.

## Runtime Components

### Architecture as Code
Not currently supported, but will be in the future (Scoot language)

### Runtime Objects
Represented inside the runtime language (in this case, Node.js)

### Repository Driver
To provide the complete developer experience, the Scoot runtime integrates with a source code control provider (such as GitHub) to provide better source management and triggers when source code is updated. The repository driver is pluggable, allowing for open source developers to provide their own implementations of the API.

### Cloud Driver
The cloud driver is responsible for converting Scoot runtime objects into physical infrastructure and configuration for a specific hosting provider. This driver is also pluggable, enabling multiple hosting providers to integrate seamlessly with the runtime.

## Runtime Workflow

1. Read in runtime configuration (if it is local, or pull it from a repository if it is not)
1. Construct runtime objects
1. Pass runtime objects to driver
1. As the runtime receives information back from the drivers, it writes configuration details to local storage
1. Wait for all asynchronous driver operations to complete
1. Report the result

The goal of the runtime is to be idempotent. This requires two pieces:

1. The desired state
1. The actual state

Keeping the actual state synchronized is the trickiest part of the runtime. The desired state is expressed by the developer to the runtime (ultimately with the Scoot language). In order to keep the actual state and desired state in sync, the runtime keeps a local copy of the desired state and uses it to compare against the desired state. If there are any changes, the runtime will make the appropriate infrastructure and configuration adjustments.

## Repository Mangement
(Reference the organiation above)

Each component gets it's own github repository.

You could have an application that only consist of one component, so there would only be one repository. Repositories are named according to the following schema:

```
{username}/{application}-{component}
```

The architecture information is stored in the following repository:

```
{username}/{application}
```

If you omit the application, the runtime will assume this is because the application name is the username/org name, and the architecture information will be stored at the following location:

```
{application}/architecture
```

You can optionally configure the driver to ommit the leading `{application}` if the application itself is an organization and thus represented in the username.

### Repository Structure
```
application/
    scoot.toml
    scoot.lock
    service-a/
        ...
    service-b/
        ...
```

```
application-resources/
    scoot.toml
    scoot.lock
    resource-a/
        ...
    resource-b/
        ...
```
