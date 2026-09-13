import inspect
from vision_agents.core import Agent, User, Runner
import vision_agents.plugins.getstream as getstream
import vision_agents.plugins.openai as openai

print("--- Agent.join signature ---")
print(inspect.signature(Agent.join))

print("\n--- Agent.create_call signature ---")
print(inspect.signature(Agent.create_call))

if hasattr(Runner, "run"):
    print("\n--- Runner.run signature ---")
    print(inspect.signature(Runner.run))

if hasattr(Runner, "serve"):
    print("\n--- Runner.serve signature ---")
    print(inspect.signature(Runner.serve))
