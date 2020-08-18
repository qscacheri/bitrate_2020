import * as Tone from 'tone'


class Sequencer {
    constructor(onNotePlayed) {
        this.onNotePlayed = onNotePlayed
        this.noteArray = new Array(64)
        this.noteArray.fill(false)
        Tone.Transport.bpm.value = 128;
        Tone.Transport.loop = true;
        Tone.Transport.loopEnd = '8m'
        this.fmSynth = new Tone.FMSynth().toMaster();

        Tone.Transport.scheduleRepeat((time) => {
            const position = Tone.Transport.position.substring(0, Tone.Transport.position.indexOf('.'))
            this.noteArray.map((noteStatus, i) => {
                if (this.indexToTicks(i) === position && noteStatus) {
                    this.fmSynth.triggerAttackRelease("C1", "4n");
                    this.onNotePlayed(i)
                }
            })
        }, "8n")
        Tone.Transport.start();
    }

    setNoteArray(array) {
        this.noteArray = array
    }

    indexToTicks(index) {
        return Tone.Ticks(96 * index).toBarsBeatsSixteenths()
    }
}



export default Sequencer