import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const User = prisma.user;
const Post = prisma.post;
const Comment = prisma.comment;

async function findingUnique() {
    return await User.findUnique({
        where: {
            username: 'user4',
            email: 'user4@example.com',
        },
        select: {
            username: true,
            subscribers: true,
            posts: {
                select: {
                    title: true,
                    content: true,
                    likes: true,
                },
            },
            _count: {
                select: {
                    posts: true,
                },
            },
        },
    });
}

async function findingFirst() {
    return await Post.findFirst({
        where: {
            likes: {
                lt: 7,
            },
        },
        include: {
            comments: true,
            _count: true,
        },
    });
}

async function findingMany() {
    return await Post.findMany({
        where: {
            comments: {
                some: {
                    likes: {
                        gt: 5,
                    },
                },
            },
        },
        select: {
            title: true,
            content: true,
            comments: {
                select: {
                    text: true,
                    likes: true,
                },
            },
        },
        orderBy: {
            id: 'desc',
        },
    });
}

async function creating() {
    return await Comment.create({
        data: {
            text: 'New Comment',
            postId: 3,
            likes: 4,
        },
        include: {
            post: {
                select: {
                    title: true,
                    content: true,
                    likes: true,
                },
            },
        },
    });
}

async function updating() {
    return await Comment.update({
        where: {
            id: 13,
        },
        data: {
            text: 'Hello World',
        },
        select: {
            id: true,
            text: true,
            likes: true,
        },
    });
}

async function upserting() {
    return await Comment.upsert({
        where: {
            id: 3,
        },
        create: {
            text: 'Another Comment',
            postId: 6,
            likes: 13,
        },
        update: {
            text: 'Very Good',
        },
    });
}

async function deleting() {
    return await Comment.delete({
        where: {
            id: 12,
        },
        include: {
            post: {
                include: {
                    comments: true,
                },
            },
        },
    });
}

async function counting() {
    return await Comment.count({
        where: {
            text: {
                notIn: ['comment 4', 'comment 5', 'comment 8', 'comment 10'],
            },
        },
        orderBy: [
            {
                likes: 'desc',
            },
            {
                id: 'desc',
            },
        ],
        select: {
            _all: true,
            likes: true,
        },
    });
}

async function aggregating() {
    return await Post.aggregate({
        where: {
            likes: {
                lt: 10,
            },
        },
        _count: {
            _all: true,
            likes: true,
        },
        _sum: {
            likes: true,
        },
        _min: {
            likes: true,
        },
    });
}

async function groupingBy() {
    return await Post.groupBy({
        where: {
            id: {
                gte: 3,
            },
        },
        by: ['authorId'],
        _sum: {
            likes: true,
        },
        _avg: {
            likes: true,
        },
        having: {
            likes: { _sum: { gte: 10 } },
        },
    });
}

async function main() {
    //use function here
    const result = await groupingBy();
    console.log(result);
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
