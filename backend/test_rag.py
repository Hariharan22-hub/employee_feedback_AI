from rag import _kb

print("Knowledge Base Loaded")
print("=" * 60)

print("Total chunks:", len(_kb.chunks))
print()

for chunk, source in zip(_kb.chunks, _kb.sources):
    print(source)
    print(chunk)
    print("-" * 60)