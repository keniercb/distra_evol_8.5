<?php

class ConfConceptospdSituacionesServicio extends BaseConfConceptospdSituacionesServicio {


    public static function obtnerConfConceptospdSituacionesServicio($idconceptospdsituacionesservicio) {
        return Doctrine::getTable('ConfConceptospdSituacionesServicio')->find($idconceptospdsituacionesservicio);
    }



}
