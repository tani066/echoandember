const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const email = process.argv[2]
    if (!email) {
        console.log('Usage: node scripts/set-admin.js <your-email>')
        return
    }

    console.log(`Looking for user: ${email}...`)

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' },
        })
        console.log(`✅ Success! User ${user.email} is now an ADMIN.`)
        console.log('You can now access /admin')
    } catch (e) {
        if (e.code === 'P2025') {
            console.error(`❌ Error: User with email "${email}" not found. Please sign in first to create your account.`)
        } else {
            console.error('❌ Error updating user:', e.message)
        }
    } finally {
        await prisma.$disconnect()
    }
}

main()
