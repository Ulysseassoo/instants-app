create policy "Enable delete for users based on user_id"
on "public"."likes"
as permissive
for delete
to authenticated
using ((id IN ( SELECT likes_1.id
   FROM (likes likes_1
     JOIN profiles ON ((likes_1.profile_id = profiles.id)))
  WHERE (auth.uid() = profiles.user_id))));


create policy "Enable insert for authenticated users only"
on "public"."likes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for users authenticated"
on "public"."likes"
as permissive
for select
to authenticated
using (true);


create policy "Enable delete for users based on their id"
on "public"."notifications"
as permissive
for delete
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = notifications.profile_id) AND (auth.uid() = profiles.user_id)))));


create policy "Enable insert for authenticated users only"
on "public"."notifications"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read for authenticated users only"
on "public"."notifications"
as permissive
for select
to authenticated
using (true);


create policy "Update notifications for a user only"
on "public"."notifications"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = notifications.owner_user_id) AND (auth.uid() = profiles.user_id)))));


create policy "Enable insert for authenticated users only"
on "public"."posts"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."posts"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."profiles"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."profiles"
as permissive
for select
to authenticated
using (true);


create policy "Users can only update their own profile"
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Delete for authenticated users"
on "public"."reposts"
as permissive
for delete
to authenticated
using ((id IN ( SELECT reposts_1.id
   FROM (reposts reposts_1
     JOIN profiles ON ((reposts_1.profile_id = profiles.id)))
  WHERE (auth.uid() = profiles.user_id))));


create policy "Enable insert for authenticated users only"
on "public"."reposts"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."reposts"
as permissive
for select
to authenticated
using (true);



