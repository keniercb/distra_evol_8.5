<?php
/**
 * Jaxl (Jabber XMPP Library)
 *
 * Copyright (c) 2009-2010, Abhinav Singh <me@abhinavsingh.com>.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *   * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *
 *   * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in
 *     the documentation and/or other materials provided with the
 *     distribution.
 *
 *   * Neither the name of Abhinav Singh nor the names of his
 *     contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRIC
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * @package jaxl
 * @subpackage xep
 * @author Abhinav Singh <me@abhinavsingh.com>
 * @copyright Abhinav Singh
 * @link http://code.google.com/p/jaxl
 */

/**
 * XEP-0060: Publisher-Subscriber
 */
class JAXL0060 {

  public static $ns = 'http://jabber.org/protocol/pubsub';

  public static function init($jaxl) {
    $jaxl->features[] = self::$ns;

    JAXLXml::addTag('message', 'event', '//message/event/@xmlns');
    JAXLXml::addTag('message', 'retractId', '//message/items/retract/@id');

    JAXLXml::addTag('message', 'itemNode', '//message/items/@node');
    JAXLXml::addTag('message', 'itemId', '//message/items/item/@id');
    JAXLXml::addTag('message', 'itemPublisher', '//message/items/item/@publisher');

    JAXLXml::addTag('message', 'headers', '//message/headers/@xmlns');
    JAXLXml::addTag('message', 'header', '//message/headers/header');
    JAXLXml::addTag('message', 'headerName', '//message/headers/header/@name');

    JAXLXml::addTag('iq', 'command:xmlns', '//iq/command/@ns');
    JAXLXml::addTag('iq', 'command:node', '//iq/command/@node');
    JAXLXml::addTag('iq', 'command:sessionid', '//iq/command/@sessionid');
    JAXLXml::addTag('iq', 'command:x:field:var', '//iq/command/x/field/@var');
    JAXLXml::addTag('iq', 'command:x:field:type', '//iq/command/x/field/@type');
    JAXLXml::addTag('iq', 'command:x:field:option:value', '//iq/command/x/field/option/value');
  }

  /*
   * Entity Use Cases
   */
  public static function discoFeatures($jaxl, $to, $from, $callback) {
    return JAXL0030::discoInfo($jaxl, $to, $from, $callback);
  }

  public static function discoNodes($jaxl, $to, $from, $callback, $node=false) {
    self::discoNodeItemsJAXLXmladdTag();
    return JAXL0030::discoItems($jaxl, $to, $from, $callback, $node);
  }

  public static function discoNodeInfo($jaxl, $to, $from, $callback, $node=false) {
    self::discoNodeInfoJAXLXmladdTag();
    return JAXL0030::discoInfo($jaxl, $to, $from, $callback, $node);
  }

  public static function discoNodeMeta($jaxl, $to, $from, $callback, $node=false) {
    return JAXL0030::discoInfo($jaxl, $to, $from, $callback, $node);
  }

  public static function discoNodeItems($jaxl, $to, $from, $callback, $node=false) {
    self::discoNodeItemsJAXLXmladdTag();
    return JAXL0030::discoItems($jaxl, $to, $from, $callback, $node);
  }

  public static function getNodeSubscriptions($jaxl, $to, $from, $callback) {
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '">';
    $payload .= '<subscriptions />';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'get', $payload, $to, $from, $callback);
  }

  public static function getNodeAffiliations($jaxl, $to, $from, $callback) {
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '">';
    $payload .= '<affiliations />';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'get', $payload, $to, $from, $callback);
  }

  /*
   * Subscriber Use Cases
   */
  public static function subscribe($jaxl, $to, $from, $node, $callback, $subJid=false, $options = false) {
    self::subscribeJAXLXmladdTag();
    if(!$subJid) $subJid = $from;
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '">';
    $payload .= '<subscribe node="' . $node . '" jid="' . $subJid . '" />';
    if($options) $payload .= '<options>' . $options . '</options>';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'set', $payload, $to, $from, $callback);
  }

  public static function unsubscribe($jaxl, $to, $from, $node, $callback, $subJid=false, $subId=false) {
    if(!$subJid) $subJid = $from;
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '">';
    $payload .= ($subid) ? '<unsubscribe node="' . $node . '" jid="' . $subJid . '" subid="' . $subId . '" />' :'<unsubscribe node="' . $node . '" jid="' . $subJid . '" />';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'set', $payload, $to, $from, $callback);
  }

  public static function getSubscriptionOption($jaxl, $to, $from, $node, $callback, $subJid=false, $subId = false) {
    if(!$subJid) $subJid = $from;
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '">';
    $payload .= ($subId) ? '<options node="' . $node . '" jid="' . $subJid . '" subid="' . $subId . '" />' : '<options node="' . $node . '" jid="' . $subJid . '" />';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'get', $payload, $to, $from, $callback);
  }

  public static function getDefaultSubscriptionOption($jaxl, $to, $from, $node, $callback) {
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '">';
    $payload .= '<default node="' . $node . '" />';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'get', $payload, $to, $from, $callback);
  }

  public static function setSubscriptionOption($jaxl, $to, $from, $node, $options,$callback, $subJid=false, $subId = false) {
    if(!$subJid) $subJid = $from;
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '">';
    $payload .= ($subId) ? '<options node="' . $node . '" jid="' . $subJid . '" subid="' . $subId . '">' : '<options node="' . $node . '" jid="' . $subJid . '">';
    $payload .= $options;
    $payload .= '</options>';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'set', $payload, $to, $from, $callback);
  }

  public static function getNodeItems($jaxl, $to, $from, $node, $callback) {
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '">';
    $payload .= '<items node="' . $node . '" />';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'get', $payload, $to, $from, $callback);
  }

  public static function getNodeItemsByItemID($jaxl, $to, $from, $node, $itemID, $callback) {
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '">';
    $payload .= '<items node="' . $node . '">';
    foreach($itemID as $k => $v) $payload .= '<item id="' . $itemID[$k] . '" />';
    $payload .= '</items>';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'get', $payload, $to, $from, $callback);
  }

  /*
   * Publisher Use Cases
   */
  public static function publishItem($jaxl, $to, $from, $node, $item, $callback, $itemId=false, $options=false) {
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '">';
    $payload .= '<publish node="' . $node . '">';
    if($itemId) $payload .= '<item id="' . $itemId . '">';
    else $payload .= '<item>';
    $payload .= $item;
    $payload .= '</item>';
    $payload .= '</publish>';

    if($options)
    {
      $payload .= '<publish-options>';
      $payload .= $options;
      $payload .= '</publish-options>';
    }
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'set', $payload, $to, $from, $callback);
  }

  public static function deleteItem($jaxl, $to, $from, $node, $itemId, $callback) {
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '">';
    $payload .= '<retract node="' . $node . '">';
    $payload .= '<item id="' . $itemId . '"/>';
    $payload .= '</retract>';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'set', $payload, $to, $from, $callback);
  }

  /*
   * Owner Use Cases
   */
  public static function createNode($jaxl, $to, $from, $node, $callback, $configure = false, $type = false) {
    self::createNodeJAXLXmladdTag();
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '">';
    $payload .= ($node == false) ? '<create />' : ($type == false) ? '<create node="' . $node . '" />' : '<create node="'.$node.'" type="'.$type.'"/>';
    if($configure != false)
    {
      $payload .= '<configure>';
      $payload .= $configure;
      $payload .= '</configure>';
    }
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'set', $payload, $to, $from, $callback);
  }

  public static function configureNode($jaxl, $to, $from, $node, $configure, $callback) {
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '#owner">';
    $payload .= '<configure node="' . $node . '">';
    $payload .= $configure;
    $payload .= '</configure>';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'set', $payload, $to, $from, $callback);
  }

  public static function getNodeConfig($jaxl, $to, $from, $node, $callback){
    self::NodeConfigJAXLXmladdTag();
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '#owner">';
    $payload .= '<configure node="' . $node . '" />';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'get', $payload, $to, $from, $callback);
  }


  public static function getDefaultNodeConfig($jaxl, $to, $from, $callback) {
    self::DefaultNodeConfigJAXLXmladdTag();
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '#owner">';
    $payload .= '<default />';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'get', $payload, $to, $from, $callback);
  }

  public static function deleteNode($jaxl, $to, $from, $node, $callback, $redirectURI=FALSE) {
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '#owner">';
    $payload .= '<delete node="' . $node . '">';
    if($redirectURI) $payload .= '<redirect uri="' . $redirectURI . '" />';
    $payload .= '</delete>';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'set', $payload, $to, $from, $callback);
  }

  public static function purgeNode($jaxl, $to, $from, $node, $callback) {
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '#owner">';
    $payload .= '<purge node="' . $node . '" />';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'set', $payload, $to, $from, $callback);
  }

  public static function getSubscriberList($jaxl, $to, $from, $node, $callback) {
    self::SubscriberListJAXLXmladdTag();
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '#owner">';
    $payload .= '<subscriptions node="' . $node . '" />';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'get', $payload, $to, $from, $callback);
  }

  public static function updateSubscription($jaxl, $to, $from, $node, $jid, $subscription, $subid, $callback) {
    if(!is_array($jid) && !is_array($subscription)) {
      $jid = array($jid);
      $subscription = array($subscription);
      $subid = array($subid);
    }

    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '#owner">';
    $payload .= '<subscriptions node="' . $node . '">';
    foreach($jid as $k => $v)
    {
      if(isset($subid[$k]) && $subid[$k] != false && $subid[$k] != null)
      $payload .= '<subscription jid="' . $jid[$k] . '" subscription="' . $subscription[$k] . '" subid="' . $subid[$k] . '" />';
      else
      $payload .= '<subscription jid="' . $jid[$k] . '" subscription="' . $subscription[$k] . '" />';
    }
    $payload .= '</subscriptions>';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'set', $payload, $to, $from, $callback);
  }

  public static function getAffiliationList($jaxl, $to, $from, $node, $callback) {
    self::AffiliationListJAXLXmladdTag();
    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '#owner">';
    $payload .= '<affiliations node="' . $node . '" />';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'get', $payload, $to, $from, $callback);
  }

  public static function updateAffiliation($jaxl, $to, $from, $node, $jid, $affiliation, $callback) {
    if(!is_array($jid) && !is_array($affiliation)) {
      $jid = array($jid);
      $affiliation = array($affiliation);
    }

    $payload = '';
    $payload .= '<pubsub xmlns="' . self::$ns . '#owner">';
    $payload .= '<affiliations node="' . $node . '">';
    foreach($jid as $k=>$v) $payload .= '<affiliation jid="' . $jid[$k] . '" affiliation="' . $affiliation[$k] . '" />';
    $payload .= '</affiliations>';
    $payload .= '</pubsub>';
    return XMPPSend::iq($jaxl, 'set', $payload, $to, $from, $callback);
  }

  public static function pendingSubscriptionRequests($jaxl, $to, $from, $callback, $node = false , $sessionid = false) {
    $payload = '';
    if($node == false) $payload = '<command xmlns="http://jabber.org/protocol/commands" node="' . self::$ns . '#get-pending" action="execute" />';
    else {
      $payload = '<command xmlns="http://jabber.org/protocol/commands" sessionid="' . $sessionid . '" node="' . self::$ns . '#get-pending" action="execute">';
      $payload .= '<x xmlns="jabber:x:data" type="submit">';
      $payload .= '<field var="pubsub#node">';
      $payload .= '<value>' . $node . '</value>';
      $payload .= '</field>';
      $payload .= '</x>';
      $payload .= '</command>';
    }
    return XMPPSend::iq($jaxl, 'set', $payload, $to, $from, $callback);
  }

  public static function manageSubscriptionRequest($jaxl, $to, $from, $node, $subjid, $subid, $allow) {
    $payload = '';
    $payload .= '<x xmlns="jabber:x:data" type="submit">';
    $payload .= '<field var="FORM_TYPE" type="hidden">';
    $payload .= '<value>' . self::$ns . '#subscribe_authorization</value>';
    $payload .= '</field>';
    $payload .= '<field var="pubsub#subid">';
    $payload .= '<value>' . $subid . '</value>';
    $payload .= '</field>';
    $payload .= '<field var="pubsub#node">';
    $payload .= '<value>' . $node . '</value>';
    $payload .= '</field>';
    $payload .= '<field var="pubsub#subscriber_jid">';
    $payload .= '<value>' . $subjid . '</value>';
    $payload .= '</field>';
    $payload .= '<field var="pubsub#allow">';
    $payload .= '<value>' . $allow . '</value>';
    $payload .= '</field>';
    $payload .= '</x>';

    return XMPPSend::message($jaxl, $to, $from, array('payload' => $payload), false, false);
  }

  /*
   * Elaborado por Marcel Mesa
   * discoNodeInfoJAXLXmladdTag
   */
  public static function discoNodeInfoJAXLXmladdTag() {

    JAXLXml::addTag('iq', 'node:', '//iq/query/@node');
    JAXLXml::addTag('iq', 'node:type', '//iq/query/identity/@type');
  }

  /*
   * Elaborado por Marcel Mesa
   * discoNodeItemsJAXLXmladdTag
   */
  public static function discoNodeItemsJAXLXmladdTag() {

    JAXLXml::addTag('iq', 'query:xmlns', '//iq/query/@ns');
    JAXLXml::addTag('iq', 'node', '//iq/query/item/@node');
    JAXLXml::addTag('iq', 'name', '//iq/query/item/@name');
  }

  /*
   * Elaborado por Marcel Mesa
   * subscribeJAXLXmladdTag
   */
  public static function subscribeJAXLXmladdTag() {

    JAXLXml::addTag('iq', 'pubsub:xmlns', '//iq/pubsub/@ns');
    JAXLXml::addTag('iq', 'node', '//iq/pubsub/subscription/@node');
    JAXLXml::addTag('iq', 'jid', '//iq/pubsub/subscription/@jid');
    JAXLXml::addTag('iq', 'subscription', '//iq/pubsub/subscription/@subscription');

  }

  /*
   * Elaborado por Marcel Mesa
   * createNodeJAXLXmladdTag
   */
  public static function createNodeJAXLXmladdTag() {

    JAXLXml::addTag('iq', 'pubsub:xmlns', '//iq/pubsub/@ns');
    JAXLXml::addTag('iq', 'node', '//iq/pubsub/create/@node');
  }

  /*
   * Elaborado por Marcel Mesa
   * NodeConfigJAXLXmladdTag
   */
  public static function NodeConfigJAXLXmladdTag() {

    JAXLXml::addTag('iq', 'pubsub:xmlns', '//iq/pubsub/@ns');
    JAXLXml::addTag('iq', 'configure:node', '//iq/pubsub/configure/@node');
    JAXLXml::addTag('iq', 'x:xmlns', '//iq/pubsub/configure/x/@ns');
    JAXLXml::addTag('iq', 'x:type', '//iq/pubsub/configure/x/@type');
    JAXLXml::addTag('iq', 'x:field:var', '//iq/pubsub/configure/x/field/@var');
    JAXLXml::addTag('iq', 'x:field:type', '//iq/pubsub/configure/x/field/@type');
    JAXLXml::addTag('iq', 'x:field:label', '//iq/pubsub/configure/x/field/@label');
    JAXLXml::addTag('iq', 'x:field:value', '//iq/pubsub/configure/x/field/value');
  }

  /*
   * Elaborado por Marcel Mesa
   * DefaultNodeConfigJAXLXmladdTag
   */
  public static function DefaultNodeConfigJAXLXmladdTag() {

    JAXLXml::addTag('iq', 'pubsub:xmlns', '//iq/pubsub/@ns');
    JAXLXml::addTag('iq', 'x:xmlns', '//iq/pubsub/default/x/@ns');
    JAXLXml::addTag('iq', 'x:type', '//iq/pubsub/default/x/@type');
    JAXLXml::addTag('iq', 'x:field:var', '//iq/pubsub/default/x/field/@var');
    JAXLXml::addTag('iq', 'x:field:type', '//iq/pubsub/default/x/field/@type');
    JAXLXml::addTag('iq', 'x:field:label', '//iq/pubsub/default/x/field/@label');
    JAXLXml::addTag('iq', 'x:field:value', '//iq/pubsub/default/x/field/value');
  }

  /*
   * Elaborado por Marcel Mesa
   * AffiliationListJAXLXmladdTag
   */
  public static function SubscriberListJAXLXmladdTag() {

    JAXLXml::addTag('iq', 'pubsub:xmlns', '//iq/pubsub/@ns');
    JAXLXml::addTag('iq', 'node', '//iq/pubsub/subscriptions/@node');
    JAXLXml::addTag('iq', 'jid', '//iq/pubsub/subscriptions/subscription/@jid');
    JAXLXml::addTag('iq', 'affiliation', '//iq/pubsub/subscriptions/subscription/@subscription');
    JAXLXml::addTag('iq', 'subid', '//iq/pubsub/subscriptions/subscription/@subid');

  }

  /*
   * Elaborado por Marcel Mesa
   * AffiliationListJAXLXmladdTag
   */
  public static function AffiliationListJAXLXmladdTag() {

    JAXLXml::addTag('iq', 'pubsub:xmlns', '//iq/pubsub/@ns');
    JAXLXml::addTag('iq', 'node', '//iq/pubsub/affiliations/@node');
    JAXLXml::addTag('iq', 'jid', '//iq/pubsub/affiliations/affiliation/@jid');
    JAXLXml::addTag('iq', 'affiliation', '//iq/pubsub/affiliations/affiliation/@affiliation');

  }
}
?>
