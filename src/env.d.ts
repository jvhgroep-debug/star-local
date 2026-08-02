/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    runtime?: {
      env?: {
        DB?: import('./lib/db/d1').D1Database;
        MEDIA?: import('./lib/media/r2').R2Bucket;
      };
    };
  }
}
