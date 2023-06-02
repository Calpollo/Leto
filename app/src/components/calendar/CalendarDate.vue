<template>
  <div class="calendardate" :style="getDateStyles()">
    <p class="timestring">
      {{ startDate.getHours() }}:{{ pad(startDate.getMinutes()) }}
      -
      {{ endDate.getHours() }}:{{ pad(endDate.getMinutes()) }}
    </p>

    <p class="datename" v-show="this.kunde">
      <b-icon-info-circle
        class="mx-2"
        :id="`tooltip-target-${this.event.id}`"
      />
      {{ this.event.Rezept.Heilmittels.map((hm) => hm.abk).join(", ") }}:
      {{ this.kunde?.firstname }}
      {{ this.kunde?.lastname }}
    </p>

    <b-tooltip
      :target="`tooltip-target-${this.event.id}`"
      v-b-tooltip.focus
      placement="bottom"
    >
      <p>
        {{ this.event.Therapeut.name }} ({{ this.event.Therapeut.geschlecht }})
      </p>
      <p>
        {{ this.kunde?.firstname }} {{ this.kunde?.lastname }},
        {{ this.event.Rezept.Heilmittels.map((hm) => hm.abk).join(", ") }}
      </p>
      <p>{{ this.event.Praxis.name }}</p>

      <b-button class="mx-2" @click="moveOrDelete" pill variant="outline-light">
        <b-icon-trash-fill />
      </b-button>
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
  </div>
</template>

<script>
import KundenService from "@/services/dbServices/KundenService";
import TerminService from "@/services/dbServices/TerminService";
import DeletionConfirmation from "../formsAndModals/DeletionConfirmation.vue";
import TerminMoveOrDelete from "../formsAndModals/TerminMoveOrDelete.vue";
import TerminMove from "../formsAndModals/TerminMove.vue";
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
  },
  mounted() {
    KundenService.getOne(this.event.Rezept.KundeId).then((k) => {
      return (this.kunde = k);
    });
  },
  components: { DeletionConfirmation, TerminMoveOrDelete, TerminMove },
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
