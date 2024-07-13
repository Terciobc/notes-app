import express from "express";
import cors from "cors"
import { PrismaClient } from "@prisma/client";

const app = express()
const PORT = process.env.PORT || 5001;
const prisma = new PrismaClient();

app.use(express.json())
app.use(cors())

app.get("/api/notes", async (req, res) => {
    try {
        const notes = await prisma.note.findMany();
        res.json(notes)
        console.log("conectada com sucesso!")
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res
            .status(400)
            .send("Título e conteúdo são requeridos")
    }
    try {

        const note = await prisma.note.create({
            data: { title, content, }
        })
        res.json(note)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }


})

app.put("/api/notes/:id", async (req, res) => {
    const { title, content } = req.body;
    const id = parseInt(req.params.id)

    if (!title || !content) {
        return res.status(400)
            .send("Título e conteúdo são requeridos!")
    }

    if (!id || isNaN(id)) {
        return res
            .status(400)
            .send("Id deve ser um número válido")
    }
    try {
        const updatedNote = await prisma.note.update({
            where: { id },
            data: { title, content }
        })
        res.json(updatedNote)
    } catch (error) {
        res.status(500)
            .send("Opa, algo errado aconteceu!")
    }
});

app.delete("/api/notes/:id", async (req, res) => {
    const id = parseInt(req.params.id)

    if (!id || isNaN(id)) {
        return res.status(400)
            .send("O id tem que ser um número válido")
    }
    try {
        await prisma.note.delete({
            where: { id }
        });
        res.status(204).send()
    } catch (error) {
        res.status(500).send("Opa, algo está errado!")
    }

})

app.listen(PORT, () => {
    console.log(`Server Running on localhost: ${PORT}`)
})