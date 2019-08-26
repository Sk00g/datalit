import { App } from "../lib/datalit/app.js";
import { Assets } from "../lib/datalit/assetManager.js";
import { Button } from "../lib/datalit/controls/button";
import { Circle } from "../lib/datalit/controls/circle.js";
import { ContentDirection, Color, HAlign, VAlign, ControlState } from "../lib/datalit/enums.js";
import { Events } from "../lib/datalit/events/events.js";
import { Icon } from "../lib/datalit/controls/icon.js";
import { Label } from "../lib/datalit/controls/label.js";
import { ListSection } from "../lib/datalit/controls/listSection.js";
import { Page } from "../lib/datalit/controls/page.js";
import { Rect } from "../lib/datalit/controls/rect.js";
import { Section } from "../lib/datalit/controls/section.js";
import { TextInput } from "../lib/datalit/controls/textInput.js";
import { SectionHost } from "../lib/datalit/controls/sectionHost.js";
import utils from "../lib/datalit/utils.js";

var shared = require("../../../tools/sharedFunc.js");

const CONFIG = {
    MONGO_CONNECTION_STRING: "mongodb+srv://scott:xCwvhN2STA84qHk$@aid-portal-08sop.gcp.mongodb.net/admin",
    MONGO_PORT: 8123,
    MONGO_HOST: "127.0.0.1",
    WS_URL: "ws://127.0.0.1:9080",
    DATE_FORMAT: "HH:mm MMM dd, yyyy"
};

export class KTHomePage extends Page {
    constructor() {
        super();

        this.setupSockets();
        this.activeShift = null;

        this.debugName = "homePage";

        this.navbar = new Section({
            contentDirection: ContentDirection.VERTICAL,
            halign: HAlign.FILL,
            valign: VAlign.TOP,
            vfillTarget: 0.08,
            backgroundColor: Assets.BaseTheme.colors.BackgroundMain,
            zValue: 1,
            debugName: "navbar"
        });
        let topSection = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.FILL,
            valign: VAlign.TOP,
            vfillTarget: -1
        });
        topSection.addChild(
            new Button({
                text: "BACK",
                action: () => this.mainContent.navigateBack(),
                halign: HAlign.LEFT,
                valign: VAlign.CENTER,
                size: [140, 32],
                margin: [8, 0, 8, 0]
            })
        );
        this.navbar.timeLabel = new Label({
            halign: HAlign.RIGHT,
            valign: VAlign.CENTER,
            margin: 14,
            fontSize: 11,
            fontColor: Assets.BaseTheme.colors.BackgroundDark
        });
        this.navbar.statusLabel = new Label({
            halign: HAlign.LEFT,
            valign: VAlign.CENTER,
            margin: 14,
            fontSize: 11,
            fontColor: Assets.BaseTheme.colors.BackgroundDark
        });
        topSection.addChild(this.navbar.timeLabel);
        topSection.addChild(this.navbar.statusLabel);
        this.navbar.addChild(topSection);

        this.navbar.titleLabel = new Label({
            text: "KEMPERTIME",
            halign: HAlign.CENTER,
            valign: VAlign.CENTER,
            margin: [0, 8, 0, 10],
            fontSize: 18,
            fontColor: Assets.BaseTheme.colors.BackgroundDark
        });
        this.navbar.addChild(this.navbar.titleLabel);

        this.homeSection = this._createHomeSection();
        this.shiftSection = this._createShiftSection();
        this.historySection = this._createHistorySection();
        this.mainContent = new SectionHost(
            {
                halign: HAlign.FILL,
                valign: VAlign.FILL,
                backgroundColor: Assets.BaseTheme.colors.BackgroundDark,
                debugName: "mainContent"
            },
            false,
            [this.historySection, this.shiftSection, this.homeSection]
        );

        this.statusBar = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.FILL,
            valign: VAlign.BOTTOM,
            vfillTarget: 0.04,
            backgroundColor: Assets.BaseTheme.colors.BackgroundMain,
            zValue: 1,
            debugName: "statusbar"
        });
        this.statusTimeLabel = new Label({
            text: utils.formatDateFull(new Date()),
            halign: HAlign.LEFT,
            valign: VAlign.CENTER,
            margin: 8,
            fontSize: 11,
            fontColor: Assets.BaseTheme.colors.BackgroundDark
        });
        this.statusTextLabel = new Label({
            text: "... connecting",
            halign: HAlign.LEFT,
            valign: VAlign.CENTER,
            margin: 8,
            fontSize: 10,
            fontColor: "33bb53"
        });
        this.statusBar.addChild(this.statusTimeLabel);
        this.statusBar.addChild(this.statusTextLabel);

        this.addSection(this.navbar);
        this.addSection(this.mainContent);
        this.addSection(this.statusBar);

        Events.register(App.Canvas, "keyup", (ev, data) => this.handleKeypress(ev, data));
    }

    setupSockets() {
        window.WebSocket = window.WebSocket || window.MozWebSocket;

        this.conn = new WebSocket(CONFIG.WS_URL);

        this.conn.onopen = () => {
            this._updateStatusText(`SUCCESS websocket connection to ${CONFIG.WS_URL}`);

            // Gather active shift information
            this.conn.send("GET\tACTIVE_SHIFT");
        };

        this.conn.onmessage = message => {
            var parts = message.data.split("\t");
            var method = parts[0];
            var designator = parts[1];

            switch (method) {
                case "HEREIS":
                    if (designator === "ACTIVE_SHIFT") {
                        var data = JSON.parse(parts[2]);
                        if (data) delete data._id;
                        this.activeShift = data;
                        this._updateActiveShiftGUI();
                    }
                    break;
            }
        };
    }

    _updateStatusText(newText, isError = false) {
        console.log(newText);
        this.statusTimeLabel.text = utils.formatDateFull(new Date()) + ":";
        this.statusTextLabel.text = newText;
        this.statusTextLabel.fontColor = isError ? "993333" : "228842";
    }

    _updateActiveShiftGUI() {
        // this._updateStatusText("updating shift GUI");
        this.navbar.statusLabel.text = this.activeShift ? "SHIFT ACTIVE" : "READY";
        this.homeSection.startButton.text = this.activeShift ? "ACTIVE" : "START";

        if (this.activeShift) {
            const start = new Date(this.activeShift.start);
            const end = new Date(this.activeShift.end);
            this.shiftSection.startInput.text = utils.formatDateFull(start);
            this.shiftSection.endInput.text = this.activeShift.end ? utils.formatDateFull(end) : "";
            this.shiftSection.shiftTotalLabel.text = utils.formatTimestamp(this._calculateShiftTotal());
            this.shiftSection.shiftWeekTotal.text = "00:00";
            this.shiftSection.breakActiveLabel.text = this.activeShift.breakStart
                ? "BREAK ACTIVE: true"
                : "BREAK ACTIVE: false";
            this.shiftSection.breakActiveLabel.fontColor = this.activeShift.breakStart ? "33ee55" : "DDDDDD";
            var total = this.activeShift.breakStart
                ? new Date() - new Date(this.activeShift.breakStart) + this.activeShift.breakTotal
                : this.activeShift.breakTotal;
            this.shiftSection.breakTotal.text = this.activeShift.breakTotal != 0 ? utils.formatTimestamp(total) : "";
        } else {
            this.shiftSection.startInput.text = "";
            this.shiftSection.endInput.text = "";
            this.shiftSection.shiftTotalLabel.text = "";
            this.shiftSection.shiftWeekTotal.text = "";
        }
    }

    _createHomeSection() {
        let home = new Section({
            halign: HAlign.FILL,
            valign: VAlign.FILL,
            backgroundColor: Assets.BaseTheme.colors.BackgroundDark,
            debugName: "home"
        });
        home.startButton = new Button({
            text: "START",
            action: btn => this.handleStartPress(btn),
            halign: HAlign.CENTER,
            valign: VAlign.TOP,
            size: [140, 32],
            margin: [0, 100, 0, 0]
        });
        home.addChild(home.startButton);
        home.addChild(
            new Button({
                text: "HISTORY",
                action: btn => this.handleHistoryPress(btn),
                halign: HAlign.CENTER,
                valign: VAlign.TOP,
                size: [140, 32],
                margin: [0, 100, 0, 0]
            })
        );
        home.addChild(
            new Button({
                text: "STATS",
                action: btn => this.handleStartPress(btn),
                halign: HAlign.CENTER,
                valign: VAlign.TOP,
                size: [140, 32],
                margin: [0, 100, 0, 0]
            })
        );

        return home;
    }

    _createShiftSection() {
        let shift = new Section({
            halign: HAlign.FILL,
            valign: VAlign.FILL,
            backgroundColor: Assets.BaseTheme.colors.BackgroundDark,
            debugName: "shift"
        });

        // Start time input
        let sec = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.CENTER,
            valign: VAlign.TOP,
            margin: [0, 40, 0, 0],
            vfillTarget: -1,
            hfillTarget: -1
        });
        sec.addChild(new Label({ text: "START" }));
        shift.startInput = new TextInput({
            margin: 12,
            valign: VAlign.CENTER,
            backgroundColor: Assets.BaseTheme.colors.TextLight,
            fontColor: Assets.BaseTheme.colors.BackgroundDark,
            borderColor: "00000000"
        });
        sec.addChild(shift.startInput);
        shift.addChild(sec);

        // End time input
        sec = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.CENTER,
            valign: VAlign.TOP,
            vfillTarget: -1,
            hfillTarget: -1
        });
        sec.addChild(new Label({ text: "END   " }));
        shift.endInput = new TextInput({
            margin: 12,
            valign: VAlign.CENTER,
            backgroundColor: Assets.BaseTheme.colors.TextLight,
            fontColor: Assets.BaseTheme.colors.BackgroundDark,
            borderColor: "00000000"
        });
        sec.addChild(shift.endInput);
        shift.addChild(sec);

        // End shift button
        shift.addChild(
            new Button({
                text: "END SHIFT",
                action: () => this.endShift(),
                halign: HAlign.CENTER,
                size: [140, 32],
                margin: 12
            })
        );

        // Break total
        sec = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.CENTER,
            valign: VAlign.TOP,
            vfillTarget: -1,
            hfillTarget: -1
        });
        sec.addChild(new Label({ text: "BREAK" }));
        shift.breakTotal = new TextInput({
            margin: 12,
            valign: VAlign.CENTER,
            backgroundColor: Assets.BaseTheme.colors.TextLight,
            fontColor: Assets.BaseTheme.colors.BackgroundDark,
            borderColor: "00000000"
        });
        sec.addChild(shift.breakTotal);
        sec.addChild(new Label({ text: "HH:mm" }));
        shift.addChild(sec);

        // Break active indicator
        shift.breakActiveLabel = new Label({ text: "BREAK ACTIVE: false", valign: VAlign.TOP, halign: HAlign.CENTER });
        shift.addChild(shift.breakActiveLabel);

        // Start and end break buttons
        sec = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.CENTER,
            valign: VAlign.TOP,
            vfillTarget: -1,
            hfillTarget: -1
        });
        sec.addChild(
            new Button({
                text: "START BREAK",
                action: () => this.startBreak(),
                size: [140, 32],
                margin: 12
            })
        );
        sec.addChild(
            new Button({
                text: "END BREAK",
                action: () => this.endBreak(),
                size: [140, 32],
                margin: 12
            })
        );
        shift.addChild(sec);

        // Shift total and Week total
        sec = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.CENTER,
            valign: VAlign.TOP,
            vfillTarget: -1,
            hfillTarget: -1
        });
        sec.addChild(new Label({ text: "SHIFT TOTAL: " }));
        shift.shiftTotalLabel = new Label({ text: /*this.getShiftTotal()*/ "02:45", fontColor: "88FF88" });
        sec.addChild(shift.shiftTotalLabel);
        shift.addChild(sec);

        sec = new Section({
            contentDirection: ContentDirection.HORIZONTAL,
            halign: HAlign.CENTER,
            valign: VAlign.TOP,
            vfillTarget: -1,
            hfillTarget: -1
        });
        sec.addChild(new Label({ text: "WEEK TOTAL: " }));
        shift.shiftWeekTotal = new Label({ text: /*this.getShiftWeekTtoal()*/ "36:08", fontColor: "88FF88" });
        sec.addChild(shift.shiftWeekTotal);
        shift.addChild(sec);

        // Label for friendly reminder when manually setting the dates
        shift.addChild(
            new Label({ text: CONFIG.DATE_FORMAT, halign: HAlign.LEFT, valign: VAlign.BOTTOM, fontSize: 8 })
        );

        // Back home option
        shift.addChild(
            new Button({
                text: "HOME",
                action: () => {
                    this.mainContent.navigateTo(this.homeSection);
                },
                size: [140, 32],
                margin: [0, 10, 0, 50],
                halign: HAlign.CENTER,
                valign: VAlign.BOTTOM
            })
        );

        // Cancellation option
        shift.addChild(
            new Button({
                text: "CANCEL SHIFT",
                action: () => this.cancelShift(),
                size: [140, 32],
                margin: 0,
                halign: HAlign.CENTER,
                valign: VAlign.BOTTOM
            })
        );

        return shift;
    }

    _createHistorySection() {
        let history = new Section({
            halign: HAlign.FILL,
            valign: VAlign.FILL,
            backgroundColor: Assets.BaseTheme.colors.BackgroundDark,
            debugName: "history"
        });

        history.listSection = new ListSection({
            halign: HAlign.FILL,
            valign: VAlign.FILL,
            templatePath: "shiftLine",
            instanceCount: 2,
            debugName: "historyList"
        });
        history.addChild(history.listSection);

        return history;
    }

    _calculateShiftTotal() {
        var totalShiftTime = new Date() - new Date(this.activeShift.start);
        var totalBreakTime = this.activeShift.breakStart
            ? new Date() - new Date(this.activeShift.breakStart) + this.activeShift.breakTotal
            : this.activeShift.breakTotal;
        return totalShiftTime - totalBreakTime;
    }

    _updateTime() {
        var now = new Date();
        this.navbar.timeLabel.text = `${now.toTimeString()} @ ${now.toDateString()}`;

        if (this.activeShift) {
            if (this.activeShift.breakStart)
                this.shiftSection.breakTotal.text =
                    this.activeShift.breakTotal != 0
                        ? utils.formatTimestamp(new Date() - this.activeShift.breakStart + this.activeShift.breakTotal)
                        : utils.formatTimestamp(new Date() - this.activeShift.breakStart);
            else {
                this.shiftSection.shiftTotalLabel.text = utils.formatTimestamp(this._calculateShiftTotal());
            }
        }
    }

    endBreak() {
        if (!this.activeShift.breakStart) return;

        this.activeShift.breakTotal += new Date() - this.activeShift.breakStart;
        this.activeShift.breakStart = null;
        this.conn.send(`SET\tACTIVE_SHIFT\t${JSON.stringify(this.activeShift)}`);
        this._updateActiveShiftGUI();
    }

    startBreak() {
        if (this.activeShift.breakStart) return;

        this.activeShift.breakStart = new Date();
        this.conn.send(`SET\tACTIVE_SHIFT\t${JSON.stringify(this.activeShift)}`);
        this._updateActiveShiftGUI();
    }

    endShift() {
        const potentialDuration = utils.formatTimestamp(new Date() - new Date(this.activeShift.start));
        if (confirm(`End shift with duration '${potentialDuration}'?`)) {
            this.activeShift.end = new Date();

            this.conn.send(`ADD\tSHIFTS\t${JSON.stringify(this.activeShift)}`);
            this.conn.send(`DELETE\tACTIVE_SHIFT`);
            this.activeShift = null;
            this._updateActiveShiftGUI();

            this.removeSection(this.shiftSection);
            this.addSection(this.homeSection);
        }
    }

    cancelShift() {
        this.activeShift = null;
        this._updateActiveShiftGUI();
        this.conn.send(`DELETE\tACTIVE_SHIFT`);

        this.mainContent.navigateTo(this.homeSection);
    }

    activate() {
        this._updateTime();
        setInterval(() => this._updateTime(), 1000);
    }

    handleStartPress(btn) {
        // Start new shift if none is active
        if (!this.activeShift) {
            this.activeShift = {
                start: new Date(),
                end: null,
                breakStart: null,
                breakTotal: 0,
                notes: null
            };
            this._updateActiveShiftGUI();
            this.conn.send("SET\tACTIVE_SHIFT\t" + JSON.stringify(this.activeShift));
        }

        this.mainContent.navigateTo(this.shiftSection);
    }

    handleHistoryPress(btn) {
        // Get updated history for the last week (default)
        var now = new Date();
        this.conn.send("GET\tSHIFTS\t" + JSON.stringify({ year: now.getFullYear(), month: now.getMonth() }));

        this.mainContent.navigateTo(this.historySection);
    }

    handleKeypress(event, data) {
        // console.log(`welcomePage event -> ${data.key} | ${data.code}`);

        switch (data.key) {
            case "a":
                break;
            case "b":
                break;
            case "c":
                break;
        }
    }
}
