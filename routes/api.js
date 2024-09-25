const Library = require('../models/library');

module.exports = function (app) {

    app.route('/api/books')
        .get(async function (req, res) {
            try {
                const data = await Library.find().exec();
                res.json(data);
            } catch (err) {
                console.log(err);
                res.status(500).send('Error fetching books');
            }
        })
        .post(async function (req, res) {
            let title = req.body.title;
            if (!title) {
                return res.send("missing required field title");
            }

            try {
                const library = new Library({ title: title });
                await library.save();
                res.json({ _id: library._id, title: title });
            } catch (err) {
                console.log(err);
                res.status(500).send('Error saving book');
            }
        })
        .delete(async function (req, res) {
            try {
                await Library.deleteMany().exec();
                res.send('complete delete successful');
            } catch (err) {
                console.log(err);
                res.status(500).send('Error deleting all books');
            }
        });

    app.route('/api/books/:id')
        .get(async function (req, res) {
            let bookid = req.params.id;

            try {
                const data = await Library.findById(bookid).exec();
                if (!data) {
                    return res.send('no book exists');
                }
                res.json(data);
            } catch (err) {
                console.log(err);
                res.send('no book exists');
            }
        })
        .post(async function (req, res) {
            let bookid = req.params.id;
            let comment = req.body.comment;

            if (!comment) {
                return res.send('missing required field comment');
            }

            try {
                const updatedBook = await Library.findByIdAndUpdate(
                    bookid,
                    { $inc: { commentcount: 1 }, $push: { comments: comment } },
                    { new: true }
                );
                if (!updatedBook) throw new Error('no book exists');
                res.json({ comments: updatedBook.comments, _id: updatedBook._id, title: updatedBook.title, commentcount: updatedBook.commentcount });
            } catch (err) {
                res.send('no book exists');
            }
        })
        .delete(async function (req, res) {
            let bookid = req.params.id;

            try {
                const deletedBook = await Library.findByIdAndDelete(bookid);
                if (!deletedBook) throw new Error('no book exists');
                res.send('delete successful');
            } catch (err) {
                res.send('no book exists');
            }
        });
};
