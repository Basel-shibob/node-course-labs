"The list is empty because each run code of node index.js .... starts a brand new process. The task array lives in that process's memory,
and when the process exits, the memory is freed.."

"the Lab 3 reflection"

" whey does presistence matter for a CLI that runs as a separate process each time?"

"Key ideas to hit (don't just copy these - use them as a checklist):
 - Each node index.js ... is a separate process with its own memory
 - RAM is freed when the process exits -> without persistence, every run starts from scratch 
 - writing to a file (disk) gives us a shared state across process runs 
 - For a CLI, that's how the "app" maintains continuity between invocations"
