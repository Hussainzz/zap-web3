
# **ZapWeb3** ⚡️
##### It provides a solution for automating repetitive tasks. Users can create custom flows will automatically be triggered by specific events emitted by smart contracts, which in turn will lead to a series of predefined actions being executed. 
#

## **Building Blocks: How i Built it** 📦 💻

### TechStack
*Turborepo, NextJS, RabbitMQ, ExpressJs, TypeScript, MySQL*


## ⏭️


In total, I have three applications. I'll go through two of the main ones: Events Service and Action Service.

The Events Service acts as the service that registers the contract events. When a user makes a request to my API, which acts as the gateway, it publishes the message to the RabbitMQ queue to register the smartcontract event. The same process applies when disabling the event listener.This service is also responsible for calling the action service as soon as the event is triggered 📣.

Next, the Action Service is responsible for executing the flow, which consists of the actions to be performed, such as posting a Slack message 💌 or Triggering a webhook 🪝. To enable the execution of these actions, I decided to implement a workflow engine. Below is the pseudocode for the minimalist workflow engine that I implemente:




## Psedocode
This is just a high-level overview of what I have implemented. You can handle scenarios where the flow should completely fail or not in case one action encounters an error. The "emit" part in the pseudocode is where I have made use of [Node.js event emitter](https://nodejs.org/en/learn/asynchronous-work/the-nodejs-event-emitter).
```
WorkflowEngine:
    flows = []

    addFlow(flow):
        flows.push(flow)

    startEngine():
        emit "workFlowEngineStarted"
        for each flow in flows:
            executeFlow(flow)

    executeFlow(flow):
        emit "flowStarted" for flow
        currentIndex = 0
        retries = 0
        previousActionResult = null

        executeNextAction():
            if currentIndex >= flow.actions.length:
                emit "flowCompleted" for flow
                return

            action = flow.actions[currentIndex]
            emit "actionStarted" for flow and action

            action.execute(previousActionResult):
                emit "actionCompleted" for flow, action, and result
                currentIndex++
                previousActionResult = result
                executeNextAction()
            catch error:
                // Handle errors here 
```

## Demo ⚡️