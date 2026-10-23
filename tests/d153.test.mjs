import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url)));
const before=read('./fixtures/worlds-before-d153.json'),after=read('../worlds-recording.json'),source=read('./fixtures/d153-worlds-source.json');
test('all pre-existing recorder data is retained exactly',()=>{
 for(const [key,value] of Object.entries(before))if(key!=='worlds')assert.deepEqual(after[key],value);
 for(const world of before.worlds)assert.deepEqual(after.worlds.find(w=>w.id===world.id),world);
});
test('42 unique unrecorded entries use the exact registry text and world keys',()=>{
 assert.equal(after.worlds.length,30);assert.equal(after.entries.length,42);
 assert.equal(new Set(after.entries.map(e=>e.key)).size,42);
 for(const row of source.values){
  const world=after.worlds.find(w=>w.id===row[1]);assert.equal(world.name,row[2]);assert.equal(world.color,row[6]);
  for(const [kind,text,tone] of [['world',row[2],'دفء وتشجيع'],['reward',row[7],'فرح واحتفال']]){
   const key=`ar.${kind}.${world.id}`,entry=after.entries.find(e=>e.key===key);
   assert.deepEqual(entry,{key,file:`soso.${key}.wav`,text,form:'مشتركة',tone,status:'لم يُسجَّل',note:'D-153'});
   assert(world.keys.includes(key));
  }
 }
});
