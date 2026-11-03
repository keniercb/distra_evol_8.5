<?php
    class ZendExt_MessageBox {
        const ERROR = 3;
        const INFO = 1;

        static function show ($pMessage, $pType) {
            $json->mensaje = $pMessage;
            $json->codMsg = $pType;

            echo json_encode($json);
        }
    }

