<!--
  - Copyright 2014-2020 the original author or authors.
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -     http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -->

<template>
  <table class="health-details table is-fullwidth">
    <tr>
      <th colspan="2">
        <span v-text="name" />
        <span class="health-details__status" :class="`health-details__status--${health.status}`"
              v-text="health.status"
        />
      </th>
    </tr>

    <tr v-if="details && details.length > 0">
      <td class="health-details__nested" colspan="2">
        <table class="health-details table is-fullwidth">
          <tr class="health-details__detail" v-for="detail in details" :key="detail.name">
            <td v-text="detail.name" />
            <td v-if="name === 'diskSpace'" v-text="typeof detail.value === 'number' ? prettyBytes(detail.value) : detail.value" />
            <td v-else-if="typeof detail.value === 'object'">
              <pre class="is-breakable" v-text="toJson(detail.value)" />
            </td>
            <td v-else class="is-breakable" v-text="detail.value" />
          </tr>
        </table>
      </td>
    </tr>

    <tr v-for="child in childHealth" :key="child.name">
      <td class="health-details__nested" colspan="2">
        <health-details :name="child.name" :health="child.value" />
      </td>
    </tr>
  </table>
</template>

<script>
  import prettyBytes from 'pretty-bytes';

  const isChildHealth = (value) => {
    return value !== null && typeof value === 'object' && 'status' in value;
  };

  export default {
    name: 'HealthDetails',
    props: {
      name: {
        type: String,
        required: true
      },
      health: {
        type: Object,
        required: true
      }
    },
    methods: {
      prettyBytes,
      toJson(obj) {
        return JSON.stringify(obj, null, 2);
      }
    },
    computed: {
      details() {
        if (this.health.details) {
          return Object.entries(this.health.details)
            .filter(([, value]) => !isChildHealth(value))
            .map(([name, value]) => ({name, value}));
        }
        return [];
      },
      childHealth() {
        if (this.health.details) {
          return Object.entries(this.health.details)
            .filter(([, value]) => isChildHealth(value))
            .map(([name, value]) => ({name, value}));
        }
        return [];
      }
    },
  }
</script>

<style lang="scss">
  // @import "~@/assets/css/utilities";

  td.health-details__nested {
    padding: 0 0 0 0.75em;
    border-bottom: 0;
  }

  td.health-details__nested pre {
    padding: 0.5em 0.75em;
  }

  .health-details__nested .table {
    margin-bottom: 0.5em;
  }

  .health-details__status {
    float: right;

    &--UP {
      color: #67C23A;
    }

    &--RESTRICTED {
      color: #E6A23C;
    }

    &--OUT_OF_SERVICE,
    &--DOWN {
      color: #F56C6C;
    }

    &--UNKNOWN,
    &--OFFLINE {
      color: #909399;
    }
  }
</style>
