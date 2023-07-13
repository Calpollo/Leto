<template>
  <div
    class="calendardate"
    :style="getDateStyles()"
    :id="`tooltip-target-${this.event.id}`"
  >
    <p>
      <b-icon-play-circle-fill v-if="event.isFirstEvent" />
      <b-icon-exclamation-triangle-fill v-if="event.isLastEvent" />
      <b-icon-exclamation-octagon-fill
        variant="danger"
        v-if="event.rezeptIsMissingTermin"
      />
      {{ startDate.getHours() }}:{{ pad(startDate.getMinutes()) }}
      -
      {{ endDate.getHours() }}:{{ pad(endDate.getMinutes()) }}
    </p>

    <p class="datename" v-show="kunde">
      {{ event.Rezept.Heilmittels.map((hm) => hm.abk).join(", ") }}:
      {{ kunde?.firstname }}
      {{ kunde?.lastname }}
    </p>

    <b-tooltip
      :target="`tooltip-target-${event.id}`"
      v-b-tooltip.focus
      placement="bottom"
    >
      <b-alert variant="warning" :show="event.isFirstEvent">
        <b-icon-play-circle-fill />
        Erster Termin des Rezepts
      </b-alert>
      <b-alert variant="warning" :show="event.isLastEvent">
        <b-icon-exclamation-triangle-fill />
        Letzter Termin des Rezepts
      </b-alert>
      <b-alert variant="danger" :show="event.rezeptIsMissingTermin">
        <b-icon-exclamation-octagon-fill />
        Für dieses Rezept fehlt ein Termin
      </b-alert>
      <p>
        {{
          toLocale(this.event.start, {
            options: {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            },
          })
        }}
      </p>
      <p>
        {{ event.Therapeut.name }}
      </p>
      <p>
        <router-link
          :to="{ name: 'Verwaltung.Patienten', query: { kunde: kunde?.id } }"
        >
          {{ kunde?.firstname }} {{ kunde?.lastname }},
        </router-link>
        <router-link
          :to="{
            name: 'Verwaltung.Rezepte',
            query: { rezept: event?.RezeptId },
          }"
        >
          Rezept ({{ event.Rezept.Heilmittels.map((hm) => hm.abk).join(", ") }})
        </router-link>
      </p>

      <b-button-group vertical>
        <b-button @click="printTerminPdf" variant="outline-light">
          <b-icon-file-earmark-pdf />
          Terminübersicht
        </b-button>
        <b-button @click="printRechnungPdf" variant="outline-light">
          <b-icon-journals />
          Rechnung
        </b-button>
        <b-button @click="moveOrDelete" variant="outline-danger">
          <b-icon-trash-fill />
          löschen / verschieben
        </b-button>
      </b-button-group>
    </b-tooltip>

    <TerminMove
      :event="event"
      :ref="'terminMove-' + event.id"
      @done="moveDate"
    />

    <TerminMoveOrDelete
      :ref="'terminMoveOrDelete-' + event.id"
      @delete="deleteDate"
      @move="openMoveModal"
    >
      <p>Du kannst den Termin entweder verschieben oder löschen.</p>
      <p>
        <b
          >{{ startDate.getHours() }}:{{ pad(startDate.getMinutes()) }}
          -
          {{ endDate.getHours() }}:{{ pad(endDate.getMinutes()) }}</b
        ><br />
        Therapeut: {{ this.event.Therapeut.name }}
      </p>
    </TerminMoveOrDelete>
    <DeletionConfirmation
      :ref="'deletionConfirmation-' + event.id"
      @confirm="confirmableFunction"
    >
      <p>
        Bist du sicher, dass du diesen Termin entfernen willst? Du kannst diese
        Entscheidung nicht mehr rückgängig machen!
      </p>
      <p>
        <b
          >{{ startDate.getHours() }}:{{ pad(startDate.getMinutes()) }}
          -
          {{ endDate.getHours() }}:{{ pad(endDate.getMinutes()) }}</b
        ><br />
        Heilmittel:
        {{ this.event.Rezept.Heilmittels.map((hm) => hm.abk).join(", ") }}<br />
        Kunde: {{ this.kunde?.firstname }} {{ this.kunde?.lastname }}<br />
        Therapeut: {{ this.event.Therapeut.name }}
      </p>
    </DeletionConfirmation>

    <TerminUebersichtPdf
      v-if="this.event.RezeptId"
      :ref="'terminuebersicht-' + event?.id"
      :RezeptId="this.event.RezeptId.toString()"
    />
    <RechnungKundePdf
      v-if="this.event?.RezeptId"
      :ref="'rechnung-' + event?.id"
      :RezeptId="this.event.RezeptId.toString()"
    />
  </div>
</template>

<script>
import KundenService from "@/services/dbServices/KundenService";
import TerminService from "@/services/dbServices/TerminService";
import DeletionConfirmation from "../formsAndModals/DeletionConfirmation.vue";
import TerminMoveOrDelete from "../formsAndModals/TerminMoveOrDelete.vue";
import TerminUebersichtPdf from "../../pdfTemplates/TerminUebersichtPdf.vue";
import RechnungKundePdf from "../../pdfTemplates/RechnungKundePdf.vue";
import TerminMove from "../formsAndModals/TerminMove.vue";
import { toLocale } from "@/utils/dates";

export default {
  name: "CalendarDate",
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      kunde: null,
      startDate: new Date(this.event.start),
      endDate: new Date(
        new Date(this.event.start).setMinutes(
          new Date(this.event.start).getMinutes() + this.event.minutes
        )
      ),
      confirmableFunction: () => {},
    };
  },
  methods: {
    toLocale,
    pad(number) {
      return String(number).padStart(2, "0");
    },
    getDateStyles() {
      return {
        backgroundColor: this.event.Therapeut.color,
      };
    },
    moveOrDelete() {
      this.$refs["terminMoveOrDelete-" + this.event.id].show();
    },
    openMoveModal() {
      this.$refs["terminMove-" + this.event.id].show();
    },
    moveDate([{ TherapeutId, date }]) {
      console.log("moveDate", this.event, TherapeutId, date);
      TerminService.update({
        ...this.event,
        TherapeutId,
        start: new Date(date),
      }).then(() => {
        this.$emit("triggerUpdate");
      });
    },
    deleteDate() {
      this.confirmableFunction = () => {
        TerminService.remove(this.event.id);
        this.$emit("triggerUpdate");
      };
      this.$refs["deletionConfirmation-" + this.event.id].show();
    },
    printTerminPdf() {
      this.$refs["terminuebersicht-" + this.event.id].generatePdf();
    },
    printRechnungPdf() {
      this.$refs["rechnung-" + this.event.id].generatePdf();
    },
  },
  mounted() {
    KundenService.getOne(this.event.Rezept.KundeId).then((k) => {
      return (this.kunde = k);
    });
  },
  components: {
    DeletionConfirmation,
    TerminMoveOrDelete,
    TerminMove,
    RechnungKundePdf,
    TerminUebersichtPdf,
  },
};
</script>

<style lang="scss" scoped>
.calendardate {
  color: white;
  display: inline-block;

  font-size: small;

  text-align: left;
  padding: 5px 10px;
  border-radius: 12px;
  overflow: hidden;
  margin: 1px 1px 0;

  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none;
  }
}

p {
  margin: 0;
}

button {
  font-size: smaller;
}
</style>
