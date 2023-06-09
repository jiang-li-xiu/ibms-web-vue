<!--
 * @Author: Yelucc
 * @Date: 2021-06-24 16:33:43
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-06-24 17:01:15
 * @Description: 
-->
<!--
  - Copyright 2014-2018 the original author or authors.
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
  <div>
    <details-datasource v-for="dataSource in dataSources" :key="dataSource"
                        :instance="instance" :data-source="dataSource"
    />
  </div>
</template>

<script>
  import sbaConfig from '@/sba-config';
  import subscribing from '@/mixins/subscribing';
  import Instance from '@/api/subsystem/instance';
  import {concatMap, delay, retryWhen, timer} from '@/utils/rxjs';
  import detailsDatasource from './details-datasource';
  import {take} from 'rxjs/operators';

  export default {
    props: {
      instance: {
        type: Instance,
        required: true
      }
    },
    mixins: [subscribing],
    components: {detailsDatasource},
    data: () => ({
      dataSources: [],
    }),
    methods: {
      async fetchDataSources() {
        const response = await this.instance.fetchMetric('data.source.active.connections');
        return response.data.availableTags.filter(tag => tag.tag === 'name')[0].values;
      },
      createSubscription() {
        const vm = this;
        return timer(0, sbaConfig.uiSettings.pollTimer.datasource)
          .pipe(concatMap(this.fetchDataSources), retryWhen(
            err => {
              return err.pipe(
                delay(1000),
                take(5)
              )
            }))
          .subscribe({
            next: names => {
              vm.dataSources = names
            },
            error: error => {
              console.warn('Fetching datasources failed:', error);
            }
          });
      }
    }
  }
</script>
