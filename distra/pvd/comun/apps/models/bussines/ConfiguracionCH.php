<?php

  /**
   * Clase que implementa la configuracion general de los modulos o componentes de
   * Capital Humano
   * Ing. Yadir Martinez Vergara
   * 29/02/2016
   */
  class ConfiguracionCH
  {
    /*Variables del modulo de registro y control del personal*/
    /*Compartimentacion de persona*/
    /*Variable para almacenar la compartimentacion que se aplicara por defecto para los usuarios que no tengan una definida
    * 1 - Acceso a todas las personas
    * 2 - Acceso por dominio
    *
    *
    */
    var $compartimentacion_defecto;

    /*Variables del modulo de control de asistencia*/
    /*Indicadores de tiempo del regimen de trabajo y descanso*/
    var $indicadores_tiempo_rtd;

    /*Identificador del espacio de trabajo de RRHH en Gestor documental*/
    var $espacioTrabajoRRHH;

    /*Identificador del espacio de trabajo de PCI en Gestor documental*/
    var $espacioTrabajoPCI;

    /*Identificador del espacio de trabajo de Nomina MINFAR*/
    var $espacioTrabajoNominaMINFAR;

    /*Identificador del espacio de trabajo de las solicitudes iniciales*/
    var $espacioTrabajoSolicitudesIniciales;
    var $espacioTrabajoSolicitudesInternas;

    function ConfiguracionCH()
    {
        $this->compartimentacion_defecto          = 1;
        $this->indicadores_tiempo_rtd['RTD-THA']  = array(
            'id' => 'RTD-THA', 'denominacion' => 'TOTAL DE HORAS DE AUSENCIAS');
        $this->indicadores_tiempo_rtd['RTD-TRT']  = array(
            'id' => 'RTD-TRT', 'denominacion' => 'TIEMPO REAL TRABAJADO');
        $this->indicadores_tiempo_rtd['RTD-HE']   = array('id' => 'RTD-HE', 'denominacion' => 'HORAS EXTRAS');
        $this->indicadores_tiempo_rtd['RTD-HTDF'] = array(
            'id' => 'RTD-HTDF', 'denominacion' => 'HORAS TRABAJADAS EN DIAS FERIADOS');
        $this->indicadores_tiempo_rtd['RTD-FTP']  = array(
            'id' => 'RTD-FTP', 'denominacion' => 'FONDO DE TIEMPO DE LA PERSONA');
        $this->indicadores_tiempo_rtd['RTD-SC']  = array(
            'id' => 'RTD-SC', 'denominacion' => 'SIN CAUSA');
        $this->indicadores_tiempo_rtd['RTD-HF']  = array(
            'id' => 'RTD-HF', 'denominacion' => 'HORAS FERIADAS');
        $this->indicadores_tiempo_rtd['RTD-HRL']  = array(
            'id' => 'RTD-HRL', 'denominacion' => 'HORAS DE RECESO LABORAL');
        $this->indicadores_tiempo_rtd['RTD-HTE']  = array(
            'id' => 'RTD-HTE', 'denominacion' => 'HORAS DE TRABAJO EXTRAORDINARIO');
        $this->indicadores_tiempo_rtd['RTD-DIASTRAB']  = array(
            'id' => 'RTD-DIASTRAB', 'denominacion' => 'DIAS TRABAJADOS');
        $this->indicadores_tiempo_rtd['RTD-DIASLAB']  = array(
            'id' => 'RTD-DIASLAB', 'denominacion' => 'DIAS LABORABLES');
        $this->indicadores_tiempo_rtd['RTD-DIASTRABMILIT']  = array(
            'id' => 'RTD-DIASTRABMILIT', 'denominacion' => 'DIAS A PAGAR A OFICIALES');
      $this->espacioTrabajoRRHH
                                                = '440afc46-7483-4d65-9036-877a39904227';//Servidor de alfresco 76: '23923b4f-5293-4531-bf0b-1e4629abb8d3';
      $this->espacioTrabajoPCI
                                                = '63c5d675-b7a7-4224-9316-c90332bf4f5f';//Servidor de alfresco 76: '7625a8ea-a50a-4e62-8c12-3cc0bf128732';
      $this->espacioTrabajoNominaMINFAR         = '6bebbdaa-0596-4500-8ad6-7291554c8be0';
      $this->espacioTrabajoSolicitudesIniciales = '1699a5bb-42d3-416f-bb3e-d074bab9f756';
      $this->espacioTrabajoSolicitudesInternas  = '2ddd46b8-1d3f-45f4-acc5-d2ba76adb6af';
      $this->espacioTrabajoPersonas             = '95c4c654-f11e-49f1-8b41-211196e04dec'; //PCI
      $this->espacioTrabajoPersonasDistraCH     = 'be09a47a-bb97-44f5-9ab3-a940ee4e3540';

    }

    function getEspacioTrabajoPCI()
    {
      return $this->espacioTrabajoPCI;
    }

    function setEspacioTrabajoPCI($idEspacioTrabajo)
    {
      $this->espacioTrabajoPCI = $idEspacioTrabajo;
    }

    function getEspacioTrabajoNominaMINFAR()
    {
      return $this->espacioTrabajoNominaMINFAR;
    }

    function setEspacioTrabajoNominaMINFAR($idEspacioTrabajo)
    {
      $this->espacioTrabajoNominaMINFAR = $idEspacioTrabajo;
    }

    function getEspacioTrabajoSolicitudesIniciales()
    {
      return $this->espacioTrabajoSolicitudesIniciales;
    }

    function setEspacioTrabajoSolicitudesIniciales($idEspacioTrabajo)
    {
      $this->espacioTrabajoSolicitudesIniciales = $idEspacioTrabajo;
    }

    function getEspacioTrabajoSolicitudesInternas()
    {
      return $this->espacioTrabajoSolicitudesInternas;
    }

    function setEspacioTrabajoSolicitudesInternas($idEspacioTrabajo)
    {
      $this->espacioTrabajoSolicitudesInternas = $idEspacioTrabajo;
    }

    function getEspacioTrabajoPersona()
    {
      return $this->espacioTrabajoPersonas;
    }

    function setEspacioTrabajoPersona($idEspacioTrabajo)
    {
      $this->espacioTrabajoPersonas = $idEspacioTrabajo;
    }
    
    function getEspacioTrabajoPersonaDistraCH()
    {
      return $this->espacioTrabajoPersonasDistraCH;
    }

    function setEspacioTrabajoPersonaDistraCH($idEspacioTrabajo)
    {
      $this->espacioTrabajoPersonasDistraCH = $idEspacioTrabajo;
    }

  }
