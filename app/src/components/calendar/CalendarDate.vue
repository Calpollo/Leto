<template>
  <div
    class="calendardate"
    :style="getDateStyles()"
    :id="`tooltip-target-${this.event.id}`"
  >
    <p>
      <b-icon-play-circle-fill v-if="event.isFirstEvent" class="mr-1" />
      <b-icon-exclamation-triangle-fill v-if="event.isLastEvent" class="mr-1" />
      <b-icon-person-dash-fill v-if="!event.erschienen" class="mr-1" />
      <b-icon-exclamation-octagon-fill
        variant="danger"
        v-if="event.rezeptIsMissingTermin"
        class="mr-1"
      />
      {{ startDate.getHours() }}:{{ pad(startDate.getMinutes()) }}
      -
      {{ endDate.getHours() }}:{{ pad(endDate.getMinutes()) }}
    </p>

    <p
      class="datename"
      v-show="kunde || event.Rezept.RezeptHeilmittels.length > 0"
    >
      <span v-if="event.Rezept.RezeptHeilmittels.length > 0">
        {{
          event.Rezept.RezeptHeilmittels.map((hmR) => hmR.Heilmittel.abk).join(
            ", "
          )
        }}
      </span>
      <span v-if="kunde">
        :
        {{ kunde?.firstname }}
        {{ kunde?.lastname }}
        ({{ dateToAge(kunde?.geburtstag) }})
      </span>
    </p>

    <b-tooltip
      v-if="event.id"
      :target="`tooltip-target-${event.id}`"
      triggers="hover"
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
        <p v-if="event.numberOfAusfallTermine > 0">
          ({{ event.numberOfAusfallTermine }}
          {{
            event.numberOfAusfallTermine > 1
              ? "Ausfalltermine"
              : "Ausfalltermin"
          }})
        </p>
      </b-alert>
      <b-alert variant="danger" :show="!event.erschienen">
        <b-icon-person-dash-fill />
        Ausfalltermin: Patient ist nicht erschienen
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
      <p class="mb-1">
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
          Rezept ({{
            event.Rezept.RezeptHeilmittels.map(
              (hmR) => hmR.Heilmittel.abk
            ).join(", ")
          }})
        </router-link>
      </p>

      <b-button-group vertical class="mb-1" size="sm">
        <b-button @click="printTerminPdf" variant="outline-light">
          <b-icon-file-earmark-pdf />
          Terminübersicht
        </b-button>
        <b-button @click="printRechnungPdf" variant="outline-light">
          <b-icon-journals />
          Rechnung
        </b-button>
        <b-button
          @click="openTerminAbsage"
          variant="outline-light"
          v-if="event.erschienen"
        >
          <b-icon-person-dash-fill />
          Patient nicht erschienen
        </b-button>
        <b-button @click="moveOrDelete" variant="outline-danger">
          <b-icon-trash-fill />
          löschen / verschieben
        </b-button>
      </b-button-group>
    </b-tooltip>

    <TerminMove
      v-if="event.id"
      :event="event"
      :ref="'terminMove-' + event.id"
      @done="moveDate"
    />

    <TerminMoveOrDelete
      v-if="event.id"
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

    <TerminAbsage
      v-if="event.id"
      :id="'terminAbsage-' + event.id"
      :event="event"
      @triggerUpdate="$emit('triggerUpdate')"
    />

    <DeletionConfirmation
      v-if="event.id"
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
        {{ this.event.Heilmittels.map((hm) => hm.abk).join(", ") }}<br />
        Kunde: {{ this.kunde?.firstname }} {{ this.kunde?.lastname }}<br />
        Therapeut: {{ this.event.Therapeut.name }}
      </p>
    </DeletionConfirmation>

    <TerminUebersichtPdf
      v-if="event.RezeptId && event.id"
      :ref="'terminuebersicht-' + event?.id"
      :RezeptId="this.event.RezeptId"
    />

    <RechnungKundePdf
      v-if="this.event?.RezeptId && event.id"
      :ref="'rechnung-' + event?.id"
      :RezeptId="this.event.RezeptId"
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
import TerminAbsage from "../formsAndModals/TerminAbsage.vue";
import { toLocale, dateToAge } from "@/utils/dates";

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
      // startDate: new Date(this.event.start),
      // endDate: new Date(
      //   new Date(this.event.start).setMinutes(
      //     new Date(this.event.start).getMinutes() + this.event.minutes
      //   )
      // ),
      confirmableFunction: () => {},
    };
  },
  methods: {
    toLocale,
    dateToAge,
    pad(number) {
      return String(number).padStart(2, "0");
    },
    getDateStyles() {
      return {
        backgroundColor: this.event.Therapeut.color,
        filter: "opacity(" + (this.event.erschienen ? 1 : 0.3) + ")",
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
    openTerminAbsage() {
      this.$bvModal.show("terminAbsage-" + this.event.id);
    },
  },
  mounted() {
    if (!this.event?.Rezept?.Kunde && this.event?.Rezept?.KundeId)
      KundenService.getOne(this.event.Rezept.KundeId).then((k) => {
        return (this.kunde = k);
      });
    else this.kunde = this.event.Rezept.Kunde;
  },
  components: {
    DeletionConfirmation,
    TerminMoveOrDelete,
    TerminMove,
    TerminAbsage,
    RechnungKundePdf,
    TerminUebersichtPdf,
  },
  computed: {
    startDate() {
      return new Date(this.event.start);
    },
    endDate() {
      return new Date(
        new Date(this.event.start).setMinutes(
          new Date(this.event.start).getMinutes() + this.event.minutes
        )
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.calendardate {
  color: white;
  display: inline-block;

  font-size: 12px;

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
  font-size: 12px;
  color: red;
}
</style>
