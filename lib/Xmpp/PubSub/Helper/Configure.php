<?php

/**
 * Xmpp_PubSub_Helper_Configure
 *
 * @author Línea de automática centro MTA -> UICD
 * @package Xmpp_PubSub_Helper
 * @version 1.0
 */

class Xmpp_PubSub_Helper_Configure
{
  /**
   *
   * Retorna la configuración codificada de un nodo
   * activo en el servicio
   * @param array $config
   * @return string
   */
  static public function createNode($config)
  {
    return self::baseNode($config);
  }

  /**
   *
   * Retorna la configuración codificada de un nodo
   * activo en el servicio
   * @param array $config
   * @return string
   */
  static public function updateNode($config)
  {
    return self::baseNode($config);
  }

  /**
   *
   * Retorna la configuración codificada de un nodo
   * activo en el servicio
   * @param array $config
   * @return string
   */
  static private function baseNode($config)
  {
    $str = <<<X
<x xmlns='jabber:x:data' type='submit'>
  <field type='hidden' label='' var='FORM_TYPE'>
    <value>http://jabber.org/protocol/pubsub#node_config</value>
  </field>
X;

    if(isset($config['access_model']))
    {
      $str .= <<<X
  <field type='list-single' var='pubsub#access_model'>
    <value>{$config['access_model']}</value>
  </field>
X;
    }

    if(isset($config['body_xslt']))
    {
      $str .= <<<X
  <field type='text-single' var='pubsub#body_xslt'>
    <value>{$config['body_xslt']}</value>
  </field>
X;
    }

    if(isset($config['children_association_policy']))
    {
      $str .= <<<X
  <field type='list-single' var='pubsub#children_association_policy'>
    <value>{$config['children_association_policy']}</value>
  </field>
X;
    }

    if(isset($config['children_association_whitelist']))
    {
      $children_association_whitelist = $config['children_association_whitelist'];
      $str .= <<<X
  <field type='jid-multi' var='pubsub#children_association_whitelist'>
X;
      foreach ($children_association_whitelist as $value) {
        $str .= <<<X
				<value>{$config['$value']}</value>
X;
      }
      $str .= <<<X
  </field>
X;
    }

    if(isset($config['children']))
    {
      $children = $config['children'];
      $str .= <<<X
  <field type='text-multi' var='pubsub#children'>'
X;
      foreach ($children as $value) {
        $str .= <<<X
		<value>{$value}</value>
X;
      }
      $str .= <<<X
 	</field>
X;
    }

    if(isset($config['children_max']))
    {
      $str .= <<<X
  <field type='text-single' var='pubsub#children_max'>
    <value>{$config['children_max']}</value>
  </field>
X;
    }

    if(isset($config['collection']))
    {
      $str .= <<<X
  <field type='text-multi' var='pubsub#collection'>
X;
      if($config['collection'] == "")
      {
        $str .= <<<X
    <value />
X;
      }
      else
      {
        $collection = $config['collection'];
        foreach ($collection as $value) {
          $str .= <<<X
    <value>{$config['$value']}</value>
X;
        }
      }
      $str .= <<<X
  </field>
X;
    }

    if(isset($config['contact']))
    {
      $contact = $config['contact'];
      $str .= <<<X
  <field type='jid-multi' var='pubsub#contact'>
X;
      foreach ($contact as $value)
      {
        $str .= <<<X
				<value>{$config['$value']}</value>
X;
      }
      $str .= <<<X
    </field>
X;
    }

    if(isset($config['dataform_xslt']))
    {
      $str .= <<<X
  <field type='text-single' var='pubsub#dataform_xslt'>
    <value>{$config['dataform_xslt']}</value>
  </field>
X;
    }

    if(isset($config['deliver_notifications']))
    {
      $str .= <<<X
  <field type='boolean' var='pubsub#deliver_notifications'>
    <value>{$config['deliver_notifications']}</value>
  </field>
X;
    }

    if(isset($config['deliver_payloads']))
    {
      $str .= <<<X
  <field type='boolean' var='pubsub#deliver_payloads'>
    <value>{$config['deliver_payloads']}</value>
  </field>
X;
    }

    if(isset($config['description']))
    {
      $str .= <<<X
  <field type='text-single' var='pubsub#description'>
    <value>{$config['description']}</value>
  </field>
X;
    }

    if(isset($config['item_expire']))
    {
      $str .= <<<X
  <field type='text-single' var='pubsub#item_expire'>
    <value>{$config['item_expire']}</value>
  </field>
X;
    }

    if(isset($config['itemreply']))
    {
      $str .= <<<X
  <field type='list-single' var='pubsub#itemreply'>
    <value>{$config['itemreply']}</value>
  </field>
X;
    }

    if(isset($config['language']))
    {
      $str .= <<<X
  <field type='list-single' var='pubsub#language'>
    <value>{$config['language']}</value>
  </field>
X;
    }

    if(isset($config['max_items']))
    {
      $str .= <<<X
  <field type='text-single' var='pubsub#max_items'>
    <value>{$config['max_items']}</value>
  </field>
X;
    }

    if(isset($config['max_payload_size']))
    {
      $str .= <<<X
  <field type='text-single' var='pubsub#max_payload_size'>
    <value>{$config['max_payload_size']}</value>
  </field>
X;
    }

    if(isset($config['node_type']))
    {
      $str .= <<<X
  <field type='list-single' var='pubsub#node_type'>
    <value>{$config['node_type']}</value>
  </field>
X;
    }

    if(isset($config['notification_type']))
    {
      $str .= <<<X
  <field type='list-single' var='pubsub#notification_type'>
    <value>{$config['notification_type']}</value>
  </field>
X;
    }

    if(isset($config['notify_config']))
    {
      $str .= <<<X
  <field type='boolean' var='pubsub#notify_config'>
    <value>{$config['notify_config']}</value>
  </field>
X;
    }

    if(isset($config['notify_retract']))
    {
      $str .= <<<X
  <field type='boolean' var='pubsub#notify_retract'>
    <value>{$config['notify_retract']}</value>
  </field>
X;
    }

    if(isset($config['notify_sub']))
    {
      $str .= <<<X
  <field type='boolean' var='pubsub#notify_sub'>
    <value>{$config['notify_sub']}</value>
  </field>
X;
    }

    if(isset($config['persist_items']))
    {
      $str .= <<<X
  <field type='boolean' var='pubsub#persist_items'>
    <value>{$config['persist_items']}</value>
  </field>
X;
    }

    if(isset($config['presence_based_delivery']))
    {
      $str .= <<<X
  <field type='boolean' var='pubsub#presence_based_delivery'>
    <value>{$config['presence_based_delivery']}</value>
  </field>
X;
    }

    if(isset($config['publish_model']))
    {
      $str .= <<<X
  <field type='list-single' var='pubsub#publish_model'>
    <value>{$config['publish_model']}</value>
  </field>
X;
    }

    if(isset($config['purge_offline']))
    {
      $str .= <<<X
  <field type='list-boolean' var='pubsub#purge_offline'>
    <value>{$config['purge_offline']}</value>
  </field>
X;
    }

    if(isset($config['roster_groups_allod']))
    {
      $roster_groups_allod = $config['roster_groups_allod'];
      $str .= <<<X
  <field type='list-multi' var='pubsub#roster_groups_allod'>
X;
      foreach ($roster_groups_allod as $value)
      {
        $str .= <<<X
		<value>{$config['$value']}</value>
X;
      }
      $str .= <<<X
  </field>
X;
    }

    if(isset($config['send_last_published_item']))
    {
      $str .= <<<X
  <field type='list-single' var='pubsub#send_last_published_item'>
    <value>{$config['send_last_published_item']}</value>
  </field>
X;
    }

    if(isset($config['tempsub']))
    {
      $str .= <<<X
  <field type='boolean' var='pubsub#tempsub'>
    <value>{$config['tempsub']}</value>
  </field>
X;
    }

    if(isset($config['title']))
    {
      $str .= <<<X
  <field type='text-single' var='pubsub#title'>
    <value>{$config['title']}</value>
  </field>
X;
    }

    if(isset($config['type']))
    {
      $str .= <<<X
  <field type='text-single' var='pubsub#type'>
    <value>{$config['type']}</value>
  </field>
X;
    }
    $str .= <<<X
</x>
X;

    return $str;
  }

  /**
   *
   * Enter description here ...
   * @param array $config
   * @return string
   */
  public static function subscriptionOption($config)
  {
    $str = <<<X
<x xmlns='jabber:x:data' type='submit'>
  <field type='hidden' label='' var='FORM_TYPE'>
    <value>http://jabber.org/protocol/pubsub#subscribe_options</value>
  </field>
X;

    if($config['deliver'])
    {
      $str .= <<<X
  <field type='boolean' var='pubsub#deliver'>
    <value>{$config['deliver']}</value>
  </field>
X;
    }

    if($config['digest'])
    {
      $str .= <<<X
  <field type='boolean' var='pubsub#digest'>
    <value>{$config['digest']}</value>
  </field>
X;
    }

    if($config['digest_frequency'])
    {
      $str .= <<<X
  <field type='text-single' var='pubsub#digest_frequency'>
    <value>{$config['digest_frequency']}</value>
  </field>
X;
    }

    if($config['expire'])
    {
      $str .= <<<X
  <field type='text-single' var='pubsub#expire'>
    <value>{$config['expire']}</value>
  </field>
X;
    }

    if($config['include_body'])
    {
      $str .= <<<X
  <field type='boolean' var='pubsub#include_body'>
    <value>{$config['include_body']}</value>
  </field>
X;
    }

    if($config['show-values'])
    {
      $showvalues = $config['show-values'];
      $str .= <<<X
  <field type='list-multi' var='pubsub#show-values'>
X;
      foreach ($showvalues as $value)
      {
        $str .= <<<X
		<value>{$value}</value>
X;
      }
      $str .= <<<X
  </field>
X;
    }

    if($config['subscription_type'])
    {
      $str .= <<<X
  <field type='list-single' var='pubsub#subscription_type'>
    <value>{$config['subscription_type']}</value>
  </field>
X;
    }

    if($config['subscription_depth'])
    {
      $str .= <<<X
  <field type='list-single' var='pubsub#subscription_depth'>
    <value>{$config['subscription_depth']}</value>
  </field>
X;
    }

    $str .= <<<X
</x>
X;

    return $str;
  }

  /**
   *
   * Enter description here ...
   * @param array $config
   * @return string
   */
  public static function publishOption($config)
  {
    $str = <<<X
<x xmlns='jabber:x:data' type='submit'>
  <field type='hidden' label='' var='FORM_TYPE'>
    <value>http://jabber.org/protocol/pubsub#subscribe-options</value>
  </field>
X;

    if($config['access_model'])
    {
      $str .= <<<X
  <field type='list-single' var='pubsub#access_model'>
    <value>{$config['access_model']}</value>
  </field>
X;
    }

    $str .= <<<X
</x>
X;

    return $str;
  }
}