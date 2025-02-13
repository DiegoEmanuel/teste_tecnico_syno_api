-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "codigo_produto" TEXT NOT NULL,
    "descricao_produto" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "foto_produto" TEXT,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Produto_codigo_produto_key" ON "Produto"("codigo_produto");
