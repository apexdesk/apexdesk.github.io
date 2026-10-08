// Every measured figure on the website, in one place.
// [value, decimals]. Sizes in MB (10^6 bytes), times in seconds.
// How each one was measured: website/README.md, "Cifras y cómo se midieron".
// After editing, run `python3 website/sync-figures.py`.
var FIGURES = {
    exe_win: [70, 0],          // ApexDesk.exe (Windows), whole program
    exe_linux: [62, 0],        // apexdesk (Linux), whole program
    // Double-click -> document on screen and nothing changing any more, with the
    // program, its libraries and the fonts out of memory (like the first start
    // after switching on the computer). Median of 3.
    start: [0.2, 1],
    lo_start: [1.2, 1],
    oo_start: [2.1, 1],
    // Same, opening a two-page letter (carta.docx).
    open_doc: [0.3, 1],
    lo_open_doc: [3.1, 1],
    oo_open_doc: [3.5, 1],
    // Memory (RSS of the whole process tree) with the letter open.
    rss_doc: [142, 0],
    lo_rss_doc: [318, 0],
    oo_rss_doc: [1145, 0],
    // Installed size.
    lo_disk: [400, 0],         // LibreOffice packages (Writer, Calc, Math)
    oo_disk: [1326, 0],        // OnlyOffice Flatpak, without the shared runtime
    oo_disk_gb: [1.3, 1],
    ms_disk: [4000, 0],        // Microsoft 365: disk space required (official)
    ms_disk_gb: [4, 0],
    cpu: "Intel Core i9-12900H",
    date_es: "septiembre de 2026",
    date_en: "September 2026"
};
