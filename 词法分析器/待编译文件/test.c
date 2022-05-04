typedef struct ArcNode {
	int adjvex;
	int info;
	struct ArcNode* nextArc;
}ArcNode;

typedef struct VNode {
	char data;
	ArcNode* firstArc;
}VNode;

typedef struct AGraph {
	int n, e;
	VNode* vexlist;
}AGraph;

void DFS(const AGraph &G, int p, bool* vis) {
	printf("%d ", p);
	for(ArcNode* i = G.vexlist[p].firstArc; i; i = i->nextArc)
		if(!vis[i->adjvex]) {
			vis[i->adjvex] = 1;
			DFS(G, i->adjvex, vis);
		}
}

void addEdge(AGraph &G, ArcNode** tail, int u, int v) {
	ArcNode* edge = (ArcNode*)malloc(sizeof(ArcNode));
	edge->adjvex = v;
	edge->nextArc = NULL;
	if(!G.vexlist[u].firstArc)
		tail[u] = G.vexlist[u].firstArc = edge;
	else {
		tail[u]->nextArc = edge;
		tail[u] = edge;
	}
}

int main() {
	int n, e;
	scanf("%d %d", &n, &e);
	
	AGraph G;
	G.n = n;
	G.e = e;
	ArcNode* tail[n];
	bool vis[n];
	G.vexlist = (VNode*)malloc(n * sizeof(VNode));
	for(int i = 0; i < n; i ++) {
		vis[i] = false;
		G.vexlist[i].firstArc = NULL;
	}
	
	for(int i = 0; i < e; i ++) {
		int u, v;
		scanf("%d %d", &u, &v);
		addEdge(G, tail, u, v);
	}
	
	for(int i = 0; i < n; i ++) 
		if(!vis[i])
			DFS(G, i, vis);
}