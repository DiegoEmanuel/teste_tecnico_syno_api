/*
  Warnings:

  - You are about to drop the `produtos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProdutoToUsers" DROP CONSTRAINT "_ProdutoToUsers_A_fkey";

-- DropTable
DROP TABLE "produtos";

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "codigo_produto" TEXT NOT NULL,
    "descricao_produto" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "foto_produto" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_codigo_produto_key" ON "products"("codigo_produto");

-- AddForeignKey
ALTER TABLE "_ProdutoToUsers" ADD CONSTRAINT "_ProdutoToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
