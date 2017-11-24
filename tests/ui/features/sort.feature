Feature: User can sort the contact list
  As a user

  Scenario: User sorts the contact list
    Given The unsorted contact list is display
    When User clicks on sort button
    Then The contact list is sorted