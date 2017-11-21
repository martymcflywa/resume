# Event store replication

## Cloud ES -> OnPrem ES -> Cache ES

## Cloud event store

### Challenges

- It's prod
- Header data stored as SQL
- Message payload stored as Azure blob JSON
- It's prod
- Users are generating events on it
    - 500B events a week or two ago
    - We want to minimize load when we generate our read models
- It's on Azure
    - Can be expensive/slow to rebuild read models from zero
- One possible solution
    - Data is replicated to OnPrem

## OnPrem event store

### Challenges

- Still relied on by a lot of people in different teams
    - Considered 'prod'
    - Again, want to minimize load during read model population and development
- Even though it's local, its stored on an SQL server
    - Still too slow for BI's read model rebuilds
    - Took hour/s during early development of Loan Book

## Solution: Event store cache

- See [CCPF.EventStore.MessagePackReplicator](https://github.com/CashConverters/CCPF.EventStore.MessagePackReplicator)
- Three main components
    - MessagePackReplicator
    - MessagePackReader.Contractless
    - MessagePackReader.Mercury

### MessagePackReplicator

- Replicate the event store from a source and replicate as binary flat files
    - Right now it points to OnPrem, minimal impact to users
- Flat files written to local disk where read models are rebuilt/refreshed
    - Fast, don't have to talk over the wire
    - Even faster with NVME drives
- Currently have two formats
    - One is bound to `Mercury.Contracts`
        - Problem
            - If update happened in that library, we would have to update the dependency in our assembly too, not ideal
        - About to be replaced
    - New version is contractless
        - No dependencies

#### High level overview

- Queries event source, retrieves a page of events
- Page of header and json messages serialized to LZ4 MessagePack binary
- Binary is written to file
- Rinse/repeat
- If process falls over, will continue from last sequenceId written to file

### MessagePackReader.Contractless

- Class library hosted on CC nuget feed
- Reads from the flat file cache
- Deserializes events as some proxy type that represents the event

### MessagePackReader.Mercury

- Same as contractless but has dependency on `Mercury.Contracts`
- Can use those types as deserializer destinations

### MessagePackReader usage

``` csharp
var reader = new EventStoreReader(pathToFlatFiles);
var events = reader.GetEvents(startSequenceId)
    .Select(rawEvent => rawEvent.GetContent<EventProxy>());
```

- Code above starts reading events starting at `startSequenceId`
- Returns `IEnumerable<EventProxy>`
    - Or `<SomeMercuryEvent>` if using MessagePackReader.Mercury
- Over to you to for filter/paging implementation

## Deployment pipeline: Github PR, AppVeyor, Octodeploy, PowerBI

