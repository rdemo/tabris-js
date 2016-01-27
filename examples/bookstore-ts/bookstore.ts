declare var require: any;
declare var tabris: any;

const PAGE_MARGIN = 16;

import { Page, WebView, TextView, Text, ScrollView, TabFolder, Tab, Composite, ImageView, CollectionView, Action, Drawer, PageSelector} from './tabris-components'
import { Spacer } from './custom-components';
import { loremIpsum , license } from './texts';
const books = require("./books.json");

/*************************
 * Application Start
 *************************/
// Drawer Init
Drawer({},[
  PageSelector
]);

// Action init
Action({
  title: "License",
  image: {src: "images/action_settings.png", scale: 3}
}).on("select", openLicensePage);

var bookStorePage = BookListPage("TS Book Store", "images/page_all_books.png", () => true);
BookListPage("Popular", "images/page_popular_books.png", book => book.popular);
BookListPage("Favorite", "images/page_favorite_books.png", book => book.favorite);

bookStorePage.open();


/*************************
 * Book Pages
 *************************/
function BookListPage(title, image, filter) {
  return (
      Page ({
        title: title,
        topLevel: true,
        image: {src: image, scale: 3}
      }, [
        BooksList(books.filter(filter)),
      ])
  )
}

function openBookPage(book) {
  return (
      Page ({title: book.title}, [
        BookDetails(book),
        Spacer,
        BookTabs(book),
      ]).open()
  )
}

function openReadBookPage(book) {
  return (
      Page ({title: book.title}, [
        ScrollView({layoutData: styles.full, direction: "vertical"}, [
          Text({
            layoutData: {left: PAGE_MARGIN, top: PAGE_MARGIN * 2, right: PAGE_MARGIN},
            textColor: "rgba(0, 0, 0, 0.5)",
            font: "bold 20px",
            text: book.title
          }),

          Text({
            layoutData: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: ["prev()", PAGE_MARGIN], bottom: PAGE_MARGIN},
            text: loremIpsum
          })
        ]),
      ]).open()
  )
}


/*************************
 * Book Sub-components
 *************************/

function BooksList(books) {
  return (
      CollectionView({
        layoutData: {left: 0, right: 0, top: 0, bottom: 0},
        itemHeight: 72,
        items: books,
        initializeCell: (cell) => {
          [
            ImageView({
              layoutData: {left: PAGE_MARGIN, centerY: 0, width: 32, height: 48},
              class: "bookImage",
              scaleMode: "fit"
            }),
            Text({
              layoutData: {left: 64, right: PAGE_MARGIN, top: PAGE_MARGIN},
              class: "bookTitle",
              textColor: "#4a4a4a"
            }),
            Text({
              layoutData: {left: 64, right: PAGE_MARGIN, top: ["prev()", 4]},
              class: "bookAuthor",
              textColor: "#7b7b7b"
            })
          ].forEach(elem => elem.appendTo(cell))

          cell.on("change:item", function(widget, book) {
            cell.children(".bookImage").set("image",book.image);
            cell.children(".bookTitle").set("text",book.title);
            cell.children(".bookAuthor").set("text",book.author);
          });
        }
      }).on("select", (target, value) => { openBookPage(value) })
  )
}

function BookDetails(book) {
  return (
      Composite({
        background: "white",
        highlightOnTouch: true,
        layoutData:{top: 0, height: 192, left: 0, right: 0}
      },[
        ImageView({
          layoutData: {height: 160, width: 106, left: PAGE_MARGIN, top: PAGE_MARGIN},
          image: book.image
        }),
        Composite({left: ["prev()", PAGE_MARGIN], top: PAGE_MARGIN, right: PAGE_MARGIN},[
          Text({
            text: book.title,
            font: "bold 20px",
            layoutData: {left: 0, top: "prev()", right: 0}
          }),
          Text({
            layoutData: {left: 0, top: "prev()", right: 0},
            text: book.author
          }),
          Text({
            layoutData: {left: 0, top: ["prev()",PAGE_MARGIN]},
            textColor: "rgb(102, 153, 0)",
            text: book.price
          })
        ])
      ]).on("tap",  () => { openReadBookPage(book) })
  )
}

function BookTabs(book) {
  return (
      TabFolder ({
        tabBarLocation: "top",
        paging: true,
        layoutData: {top: "prev()", left: 0, right: 0, bottom: 0}
      }, [
        // Related Tab
        Tab({title: "Related"},[
          BooksList(books)
        ]),
        // Comments Tab
        Tab({title: "Comments"},[
          Text({
            layoutData: {left: PAGE_MARGIN, top: PAGE_MARGIN, right: PAGE_MARGIN},
            text: "Great Book."
          })
        ])
      ])
  )
}


/*************************
 * License Pages
 *************************/

function openLicensePage() {
  return (
      Page ({title: "License"}, [
        Text({text: license.header, layoutData: styles.license.item}),

        Text({
          text: license.link.caption,
          textColor: "rgba(71, 161, 238, 0.75)",
          layoutData: styles.license.item
        }).on("tap", openLicenseWebPage ),

        Text({
          text: license.authors,
          markupEnabled: true,
          layoutData: styles.license.item
        }),
      ]).open()
  )
}

function openLicenseWebPage() {
  return (
    Page ({title: license.link.caption},[
      WebView ({
        layoutData: styles.full,
        url: license.link.url
      })
    ]).open()
  )
}

/*************************
 * Styles
 *************************/

var styles = {
  license: {
    item: {left: PAGE_MARGIN, right: PAGE_MARGIN, top: ["prev()", 10]}
  },

  stack:{top: "prev()", left: 0, right: 0},
  full: {left: 0, top: 0, right: 0, bottom: 0},
};
